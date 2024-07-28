import { WorkerHostProcessor } from './worker-host.processor';
import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { THE_GUARDIAN } from '../../constants';
import { Job } from 'bullmq';
import { TheGuardianService } from '../../the-guardian.service';
import { InjectModel } from '@nestjs/mongoose';
import { NewsFeed } from '../../entities/news-feed.document';
import { Model } from 'mongoose';

@Processor(THE_GUARDIAN)
@Injectable()
export class TheGuardianProcessor extends WorkerHostProcessor {
  constructor(
    private theGuardianService: TheGuardianService,
    @InjectModel(NewsFeed.name) private readonly newsFeedModel: Model<NewsFeed>,
  ) {
    super();
  }

  async process(job: Job) {
    const { searchkey, tags, email } = job.data;
    const theGuardianResult = await this.theGuardianService.searchTopHeadlines(
      searchkey,
      tags,
    );
    //console.log('theGuardianResult', theGuardianResult);
    await this.newsFeedModel.create({
      date: new Date(),
      email: email,
      news: [...theGuardianResult],
    });
    return Promise.resolve([...theGuardianResult]);
  }
}
