import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NewsDto } from '../dto/news.dto';
@Schema()
export class NewsFeed {
  @Prop()
  date: Date;

  @Prop()
  email: string;

  @Prop(raw(NewsDto))
  news: NewsDto[];
}

export const NewsFeedSchema = SchemaFactory.createForClass(NewsFeed);
