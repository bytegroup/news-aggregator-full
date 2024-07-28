import { IsDate, IsString } from 'class-validator';

export class NewsDto {
  @IsString()
  source: string;

  @IsString()
  title: string;

  @IsString()
  webUrl: string;

  @IsString()
  tags: string;

  @IsDate()
  publishedAt: Date;
}
