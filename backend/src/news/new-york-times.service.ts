import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as process from 'node:process';
import { firstValueFrom } from 'rxjs';
import {
  filterResultUsingTags,
  newYorkTimesResultMapNewsDto,
} from '../utilities/utils';
import { Sources } from './enums/sources.enum';

const apiKey =
  process.env.NEW_YORK_TIMES_KEY || 'Dg51tK6BnTkAu0xYJmvNqcrVnxkTscxk';
const NEW_YORK_TIMES_URL =
  process.env.NEW_YORK_TIMES_URL || 'https://api.nytimes.com';

@Injectable()
export class NewYorkTimesService {
  constructor(private readonly httpService: HttpService) {}

  async searchTopHeadlines(searchKey: string, tags: string) {
    const res = await firstValueFrom(
      this.httpService.get(
        `${NEW_YORK_TIMES_URL}/svc/search/v2/articlesearch.json?api-key=${apiKey}&q=${searchKey}`,
      ),
    );

    //console.log('nytime: res', res.data.response.docs);

    if (tags) {
      res.data.response.docs = await filterResultUsingTags(
        res.data.response.docs,
        tags,
      );
    }

    res.data.response.docs = await newYorkTimesResultMapNewsDto(
      res.data.response.docs,
      Sources.NEW_YORK_TIMES,
    );
    //console.log('news searchTopHeadlines', res.data.docs);
    return res.data.response.docs;
  }
}
