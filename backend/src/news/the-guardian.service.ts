import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as process from 'node:process';
import { firstValueFrom } from 'rxjs';
import {
  filterResultUsingTags,
  theGuardianResultMapNewsDto,
} from '../utilities/utils';
import { Sources } from './enums/sources.enum';

const apiKey =
  process.env.GUARDIAN_KEY || '7075c509-b720-4a8c-a0fc-50accdc112e7';
const GUARDIAN_URL =
  process.env.GUARDIAN_URL || 'https://content.guardianapis.com';

@Injectable()
export class TheGuardianService {
  constructor(private readonly httpService: HttpService) {}
  async searchTopHeadlines(searchKey: string, tags: string) {
    const res = await firstValueFrom(
      this.httpService.get(
        `${GUARDIAN_URL}/search?api-key=${apiKey}&q=${searchKey}`,
      ),
    );
    //console.log('guardian: res', res.data.response.results);
    if (tags) {
      res.data.response.results = await filterResultUsingTags(
        res.data.response.results,
        tags,
      );
    }

    res.data.response.results = await theGuardianResultMapNewsDto(
      res.data.response.results,
      Sources.THE_GUARDIAN,
    );
    //console.log('news searchTopHeadlines', res.data);
    return res.data.response.results;
  }
}
