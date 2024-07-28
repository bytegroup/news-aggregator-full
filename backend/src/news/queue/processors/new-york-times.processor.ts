import { WorkerHostProcessor } from './worker-host.processor';
import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { NEW_YORK_TIMES } from '../../constants';
import { Job } from 'bullmq';
import { NewsSettingsDto } from '../../dto/news-settings.dto';
import { NewYorkTimesService } from '../../new-york-times.service';
import { InjectModel } from '@nestjs/mongoose';
import { NewsFeed } from '../../entities/news-feed.document';
import { Model } from 'mongoose';

@Processor(NEW_YORK_TIMES)
@Injectable()
export class NewYorkTimesProcessor extends WorkerHostProcessor {
  constructor(
    private newYorkTimesService: NewYorkTimesService,
    @InjectModel(NewsFeed.name) private readonly newsFeedModel: Model<NewsFeed>,
  ) {
    super();
  }

  async process(job: Job) {
    const { searchkey, tags, email } = job.data;
    const newYorkTimesResult =
      await this.newYorkTimesService.searchTopHeadlines(searchkey, tags);

    await this.newsFeedModel.create({
      date: new Date(),
      email: email,
      news: [...newYorkTimesResult],
    });
    return Promise.resolve([...newYorkTimesResult]);
  }
}
