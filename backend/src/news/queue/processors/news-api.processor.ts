import { WorkerHostProcessor } from './worker-host.processor';
import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { NEWS_API } from '../../constants';
import { Job } from 'bullmq';
import { NewsApiService } from '../../NewsApi.service';
import { InjectModel } from '@nestjs/mongoose';
import { NewsFeed } from '../../entities/news-feed.document';
import { Model } from 'mongoose';

@Processor(NEWS_API)
@Injectable()
export class NewsApiProcessor extends WorkerHostProcessor {
  constructor(
    private newsApiService: NewsApiService,
    @InjectModel(NewsFeed.name) private readonly newsFeedModel: Model<NewsFeed>,
  ) {
    super();
  }

  async process(job: Job) {
    const { searchkey, tags, email } = job.data;
    const newsApiResult = await this.newsApiService.searchTopHeadlines(
      searchkey,
      tags,
    );

    await this.newsFeedModel.create({
      date: new Date(),
      email: email,
      news: [...newsApiResult],
    });
    return Promise.resolve([...newsApiResult]);
  }
}
