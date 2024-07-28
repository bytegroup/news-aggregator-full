import { BullModule } from '@nestjs/bullmq';
import * as process from 'node:process';

export const queueConfig = BullModule.forRoot({
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 100,
    attempts: 3,
  },
});
