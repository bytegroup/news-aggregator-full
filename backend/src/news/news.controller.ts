import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { NewsSettingsDto } from './dto/news-settings.dto';
import { TransformInterceptor } from '../utilities/global-resonse.interceptor';
import { AuthUser } from '../auth/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { Queue } from 'bullmq';
import { InjectNewsApiQueue } from './decorators/queue.decorator';

@ApiTags('news')
@Controller('news')
export class NewsController {
  private readonly logger = new Logger(NewsController.name);
  constructor(
    private readonly newsService: NewsService,
    @InjectNewsApiQueue()
    private readonly newsApiQueue: Queue,
  ) {}

  @Post('/settings')
  @UseInterceptors(TransformInterceptor)
  async create(@AuthUser() user: User, @Body() settingsDto: NewsSettingsDto) {
    console.log('user set setting called', settingsDto);
    return await this.newsService.saveNewsSettings(settingsDto, user);
  }

  @Get('/settings')
  @UseInterceptors(TransformInterceptor)
  async getSettings(@AuthUser() user: User) {
    return await this.newsService.getNewsSettings(user.id);
  }

  @Public()
  @Get('/')
  findAll() {
    return this.newsService.findAll();
  }

  //@Public()
  @Get('/feeds')
  async findNewsFeed(@AuthUser() user: User) {
    //return this.newsService.generateNewsFeed(user);
    return await this.newsService.pullNewsFeed(user);
  }

  @Public()
  @Get('/feeds-trigger')
  async triggerNewsFeed() {
    //return this.newsService.generateNewsFeed(user);
    return await this.newsService.populateNewsFeed();
  }

  @Get('/search')
  async searchNews(@Query() searchKeys) {
    return await this.newsService.searchNews(searchKeys);
  }

  @Public()
  @Get('/sources')
  async newsSources() {
    return await this.newsService.getSources();
  }
}
