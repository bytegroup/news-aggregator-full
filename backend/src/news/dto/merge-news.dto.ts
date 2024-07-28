import { ArrayNotEmpty, IsArray } from 'class-validator';
import { NewsDto } from './news.dto';

export class MergeNewsDto {
  @IsArray()
  @ArrayNotEmpty()
  data: NewsDto[];
}
