import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as process from 'node:process';
import {
  filterNewsApiByTags,
  filterResultUsingTags,
  newsApiResultMapNewsDto,
} from '../utilities/utils';
import { Sources } from './enums/sources.enum';
import { firstValueFrom } from 'rxjs';

const newsApiKey: string =
  process.env.NEWS_API_KEY || 'e91626e4685840089180d7456bc56cb6';
const newsApiUrl: string = process.env.NEWS_API_URL || 'https://newsapi.org';

@Injectable()
export class NewsApiService {
  constructor(private readonly httpService: HttpService) {}

  async searchTopHeadlines(searchKey: string, tags: string) {
    const res = await firstValueFrom(
      this.httpService.get(
        `${newsApiUrl}/v2/everything?q=${searchKey}&apiKey=${newsApiKey}`,
      ),
    );

    //console.log('newsApi: res', res.data.articles);

    if (tags) {
      res.data.articles = await filterNewsApiByTags(res.data.articles, tags);
    }

    res.data.articles = await newsApiResultMapNewsDto(
      res.data.articles,
      Sources.NEWS_API,
    );
    //console.log('news searchTopHeadlines', res.articles);
    return res.data.articles;
  }
}
