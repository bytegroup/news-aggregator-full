import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { NewsSettings } from './entities/news-settings.entity';
import { QueueModule } from '../database/queue-board.module';
import {
  NEW_YORK_TIMES,
  NEWS_API,
  NEWS_MERGE,
  THE_GUARDIAN,
} from './constants';
import { NewsApiService } from './NewsApi.service';
import { TheGuardianService } from './the-guardian.service';
import { NewYorkTimesService } from './new-york-times.service';
import { NewYorkTimesProcessor } from './queue/processors/new-york-times.processor';
import { TheGuardianProcessor } from './queue/processors/the-guardian.processor';
import { SourceProcessor } from './queue/processors/source.processor';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsFeed, NewsFeedSchema } from './entities/news-feed.document';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([News, NewsSettings, User]),
    MongooseModule.forFeature([
      { name: NewsFeed.name, schema: NewsFeedSchema },
    ]),
    QueueModule.register({
      queues: [NEWS_API, THE_GUARDIAN, NEW_YORK_TIMES, NEWS_MERGE],
      flows: [],
    }),
  ],
  controllers: [NewsController],
  providers: [
    NewsService,
    NewsApiService,
    TheGuardianService,
    NewYorkTimesService,
    NewYorkTimesProcessor,
    TheGuardianProcessor,
    NewYorkTimesProcessor,
    SourceProcessor,
  ],
})
export class NewsModule {}
