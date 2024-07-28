//src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true, // Be cautious about using synchronize in production
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
      dbName: process.env.MONGO_DB,
    }),
  ],
})
export class DatabaseModule {}
