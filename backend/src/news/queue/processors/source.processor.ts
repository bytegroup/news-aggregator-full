import { WorkerHostProcessor } from './worker-host.processor';
import { Injectable } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { NEWS_MERGE } from '../../constants';
import { MergeNewsDto } from '../../dto/merge-news.dto';
import { Job } from 'bullmq';

@Processor(NEWS_MERGE)
@Injectable()
export class SourceProcessor extends WorkerHostProcessor {
  async process(
    job: Job<MergeNewsDto, string | string[], string>,
  ): Promise<number | number[]> {
    const results = Object.values(await job.getChildrenValues());

    return Promise.resolve(results);
  }
}
