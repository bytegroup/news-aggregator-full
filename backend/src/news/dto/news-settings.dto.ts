import { IsNumber, IsOptional, IsString } from 'class-validator';

export class NewsSettingsDto {
  @IsNumber()
  @IsOptional()
  id: number | undefined;

  @IsString()
  source: string | null;

  @IsString()
  searchkey: string | null;

  @IsString()
  tags: string | null;
}
