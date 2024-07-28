import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';
import { NewsModule } from './news/news.module';
import { AxiosRetryModule } from 'nestjs-axios-retry';
import axiosRetry from 'axios-retry';
import { queueConfig } from './database/conf/queue.config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AxiosRetryModule.forRoot({
      axiosRetryConfig: {
        retries: 5,
        retryDelay: axiosRetry.exponentialDelay,
        shouldResetTimeout: true,
        retryCondition: (error) => error?.response?.status === 429,
        onRetry: (retryCount, error, requestConfig) => {
          console.log(`Retrying request attempt ${retryCount}`);
          console.log(`Retrying err: ${error}`);
          console.log(`Retrying config: ${requestConfig}`);
        },
      },
    }),
    ScheduleModule.forRoot(),
    queueConfig,
    DatabaseModule,
    UsersModule,
    AuthModule,
    CoreModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
