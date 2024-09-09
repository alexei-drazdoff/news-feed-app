import { fetchNews, fetchNewsDetail } from './api';
import type { NewsItem } from '@/types/news';

export class NewsError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'NewsError';
  }
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    return await fetchNews();
  } catch (error) {
    console.error('Error in getNews:', error);
    if (error instanceof Error && 'response' in error && error.response && typeof error.response === 'object') {
      const response = error.response as { statusText?: string; status?: number };
      if (response.statusText && response.status) {
        throw new NewsError(`Failed to fetch news: ${response.statusText}`, response.status);
      }
    }
    throw new NewsError('Failed to fetch news', 500);
  }
}

export async function getNewsDetail(id: string): Promise<NewsItem> {
  try {
    return await fetchNewsDetail(id);
  } catch (error) {
    console.error('Error in getNewsDetail:', error);
    if (error instanceof Error && 'response' in error && error.response && typeof error.response === 'object') {
      const response = error.response as { statusText?: string; status?: number };
      if (response.status === 404) {
        throw new NewsError('News item not found', 404);
      }
      if (response.statusText && response.status) {
        throw new NewsError(`Failed to fetch news detail: ${response.statusText}`, response.status);
      }
    }
    throw new NewsError('Failed to fetch news detail', 500);
  }
}
