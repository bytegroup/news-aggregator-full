import { Injectable } from '@nestjs/common';
import { InjectMergeFlowProducerQueue } from './decorators/queue.decorator';
import { FlowChildJob, FlowProducer } from 'bullmq';
import { NEWS_API, NEWS_MERGE } from './constants';
import { Sources } from './enums/sources.enum';
import { MergeNewsDto } from './dto/merge-news.dto';

@Injectable()
export class SourceFlowService {
  constructor(
    @InjectMergeFlowProducerQueue() private mergeFlowProducer: FlowProducer,
  ) {}

  async createNewsBulkFlow(dto: MergeNewsDto): Promise<string[]> {
    /*const minChildren = this.createChildrenJobs(dto, MATH_ARRAY_OPS.MIN);
    const maxChildren = this.createChildrenJobs(dto, MATH_ARRAY_OPS.MAX);

    const flows = await this.mergeFlowProducer.addBulk([
      {
        name: Sources.NEWS_API,
        queueName: NEWS_MERGE,
        children: this.createChildrenJobs(dto, ),
        opts: {
          failParentOnFailure: true,
        },
      },
      {
        name: Sources.THE_GUARDIAN,
        queueName: NEWS_MERGE,
        children: maxChildren,
        opts: {
          failParentOnFailure: true,
        },
      },
      {
        name: Sources.NEW_YORK_TIMES,
        queueName: NEWS_MERGE,
        children: maxChildren,
        opts: {
          failParentOnFailure: true,
        },
      },
    ]);

    return flows.map((flow) => flow.job.id || '');*/
    return null;
  }

  private createChildrenJobs(
    dto: MergeNewsDto,
    jobName: Sources,
    queueName: string,
  ) {
    //const numPartitions = Math.ceil(dto.data.length / PARTITION_SIZE);
    const startIdx = 0;

    const children: FlowChildJob[] = [];
    /*for (let i = 0; i < numPartitions - 1; i++) {
      children.push({
        name: jobName,
        data: {
          data: dto.data.slice(startIdx, startIdx + PARTITION_SIZE),
          percentage: (100 / numPartitions) * (i + 1),
        },
        queueName: queueName,
      });
      startIdx = startIdx + PARTITION_SIZE;
    }*/

    children.push({
      name: jobName,
      data: { data: dto.data.slice(startIdx), percentage: 100 },
      queueName: queueName,
    });

    return children;
  }
}
