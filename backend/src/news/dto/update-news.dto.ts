import { PartialType } from '@nestjs/swagger';
import { NewsDto } from './news.dto';

export class UpdateNewsDto extends PartialType(NewsDto) {}
