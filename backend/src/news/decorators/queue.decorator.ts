import { InjectQueue } from '@nestjs/bullmq';
import {
  NEW_YORK_TIMES,
  NEWS_API,
  NEWS_MERGE,
  THE_GUARDIAN,
} from '../constants';

export const InjectNewsApiQueue = () => InjectQueue(NEWS_API);
export const InjectTheGuardianQueue = () => InjectQueue(THE_GUARDIAN);
export const InjectNewYorkTimesQueue = () => InjectQueue(NEW_YORK_TIMES);
export const InjectMergeFlowProducerQueue = () => InjectQueue(NEWS_MERGE);
