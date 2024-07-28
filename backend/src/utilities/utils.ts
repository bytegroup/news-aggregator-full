import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { NewsDto } from '../news/dto/news.dto';

export const toPromise = <T>(data: T): Promise<T> => {
  return new Promise<T>((resolve) => {
    resolve(data);
  });
};

export const comparePasswords = async (userPassword, currentPassword) => {
  return await bcrypt.compare(currentPassword, userPassword);
};

export const filterResultUsingTags = async (result: any[], tags: string) => {
  return result?.filter((item) => item.author?.includes(tags));
};

export const newsApiResultMapNewsDto = async (
  result: any[],
  source: string,
): Promise<NewsDto[]> => {
  if (!result?.length) {
    return [];
  }
  return result.map((item) => {
    return {
      source: source,
      webUrl: item.url,
      title: item.title,
      publishedAt: item.publishedAt,
      tags: item.author,
    };
  });
};

export const theGuardianResultMapNewsDto = async (
  result: any[],
  source: string,
): Promise<NewsDto[]> => {
  if (!result?.length) {
    return [];
  }
  return result.map((item) => {
    return {
      source: source,
      webUrl: item.webUrl,
      title: item.webTitle,
      publishedAt: item.webPublicationDate,
      tags: item.pillarName,
    };
  });
};

export const newYorkTimesResultMapNewsDto = async (
  result: any[],
  source: string,
): Promise<NewsDto[]> => {
  if (!result?.length) {
    return [];
  }
  return result.map((item) => {
    return {
      source: source,
      webUrl: item.web_url,
      title: item.headline.main,
      publishedAt: item.pub_date,
      tags: item.source,
    };
  });
};
