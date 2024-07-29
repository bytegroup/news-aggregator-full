import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NewsSettingsDto } from './dto/news-settings.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsSettings } from './entities/news-settings.entity';
import { User } from '../users/entities/user.entity';
import { Sources } from './enums/sources.enum';
import {
  InjectNewsApiQueue,
  InjectNewYorkTimesQueue,
  InjectTheGuardianQueue,
} from './decorators/queue.decorator';
import { Queue } from 'bullmq';
import { Cron } from '@nestjs/schedule';
import { NewsFeed } from './entities/news-feed.document';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as process from 'node:process';
import { NewsDto } from './dto/news.dto';
import { NewsApiService } from './NewsApi.service';
import { TheGuardianService } from './the-guardian.service';
import { NewYorkTimesService } from './new-york-times.service';

@Injectable()
export class NewsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(NewsSettings)
    private readonly newsSettingsRepository: Repository<NewsSettings>,
    @InjectModel(NewsFeed.name) private readonly newsFeedModel: Model<NewsFeed>,
    @InjectNewsApiQueue()
    private readonly newsApiQueue: Queue,
    @InjectTheGuardianQueue()
    private readonly theGuardianQueue: Queue,
    @InjectNewYorkTimesQueue()
    private readonly newYorkTimesQueue: Queue,
    private newsApiService: NewsApiService,
    private theGuardianService: TheGuardianService,
    private newYorkTimesService: NewYorkTimesService,
  ) {}

  async getSources(): Promise<Sources[]> {
    return Promise.resolve(Object.values(Sources));
  }

  async saveNewsSettings(settings: NewsSettingsDto, user: User) {
    const newsSettings: NewsSettings = { ...settings, userId: user.id };
    if (!settings.id) {
      delete settings.id;
    }
    await this.newsSettingsRepository.save(newsSettings);
    return { newsSettings: settings };
  }

  async getNewsSettings(userId: number) {
    const settingRes = await this.newsSettingsRepository.findOne({
      where: { userId: userId },
    });
    return settingRes
      ? settingRes
      : { id: 0, source: '', searchkey: '', tags: '' };
  }

  async findAll() {
    const response = await firstValueFrom(
      this.httpService.get(
        'https://newsapi.org/v2/top-headlines?country=us&apiKey=e91626e4685840089180d7456bc56cb6',
      ),
    );
    return response.data;
  }

  async pullNewsFeed(user: User) {
    //this.generateNewsFeed(user);
    const fromDate = new Date();
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date();
    toDate.setHours(23, 59, 59, 999);
    const newsFeed = await this.newsFeedModel
      .find({
        email: { $eq: user.email },
        date: { $gte: fromDate, $lt: toDate },
      })
      .exec();

    const newsFeedMerge: NewsDto[] = [];
    newsFeed.forEach((item) => {
      newsFeedMerge.push(...item.news);
    });

    return Promise.resolve(newsFeedMerge);
  }

  @Cron(process.env.NEWS_FEEDS_TIMER)
  public async populateNewsFeed() {
    const settings = await this.newsSettingsRepository.find();
    console.log('feed trigger - news-settings', settings);
    const settingsMap: Map<number, NewsSettings> = new Map();
    settings.forEach((setting) => {
      settingsMap.set(setting.userId, setting);
    });
    const userIds = settings.map((setting) => setting.userId);
    console.log('feed trigger - user ids', userIds);
    const users = await this.usersRepository.find({
      where: { id: In([...userIds]) },
    });
    console.log('feed trigger - users', users);
    for (const user of users) {
      await this.generateNewsFeed(user, settingsMap.get(user.id));
    }
  }

  private async generateNewsFeed(user: User, newsSettings: NewsSettings) {
    console.log('generate news feed - user', user);
    console.log('generate news feed - settings', newsSettings);
    switch (newsSettings.source) {
      case Sources.NEWS_API:
        const newsApiJob = await this.newsApiQueue.add(Sources.NEWS_API, {
          email: user.email,
          ...newsSettings,
        });
        return { job1: newsApiJob };

      case Sources.THE_GUARDIAN:
        const theGuardianJob = await this.theGuardianQueue.add(
          Sources.THE_GUARDIAN,
          { email: user.email, ...newsSettings },
        );
        return { job1: theGuardianJob };

      case Sources.NEW_YORK_TIMES:
        const newYorkTimesJob = await this.newYorkTimesQueue.add(
          Sources.NEW_YORK_TIMES,
          { email: user.email, ...newsSettings },
        );
        return { job1: newYorkTimesJob };

      default:
        const newsApiJobDefault = await this.newsApiQueue.add(
          Sources.NEWS_API,
          {
            email: user.email,
            ...newsSettings,
          },
        );
        const theGuardianJobDefault = await this.theGuardianQueue.add(
          Sources.THE_GUARDIAN,
          { email: user.email, ...newsSettings },
        );
        const newYorkTimesJobDefault = await this.newYorkTimesQueue.add(
          Sources.NEW_YORK_TIMES,
          { email: user.email, ...newsSettings },
        );
        return {
          job1: newsApiJobDefault,
          job2: theGuardianJobDefault,
          job3: newYorkTimesJobDefault,
        };
    }
  }

  async searchNews(keys) {
    console.log('news searching with key ', keys);
    switch (keys.source) {
      case Sources.NEW_YORK_TIMES:
        return Promise.resolve(
          await this.newYorkTimesService.searchTopHeadlines(
            keys.searchkey,
            null,
          ),
        );
      case Sources.NEWS_API:
        return Promise.resolve(
          await this.newsApiService.searchTopHeadlines(keys.searchkey, null),
        );
      case Sources.THE_GUARDIAN:
        return Promise.resolve(
          await this.theGuardianService.searchTopHeadlines(
            keys.searchkey,
            null,
          ),
        );
      default:
        throw new Error('Source not found');
    }

    //return keys;
  }
}
