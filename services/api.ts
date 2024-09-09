import axios from 'axios';
import type { NewsItem } from '@/types/news';

const createApi = () => {
  const config = useRuntimeConfig();
  return axios.create({
    baseURL: '/api',
    timeout: config.public.apiTimeout as number,
  });
};

export const fetchNews = async (): Promise<NewsItem[]> => {
  const api = createApi();
  try {
    const response = await api.get<NewsItem[]>('/news');
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const fetchNewsDetail = async (id: string): Promise<NewsItem> => {
  const api = createApi();
  try {
    const response = await api.get<NewsItem>(`/news/${encodeURIComponent(id)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news detail:', error);
    throw error;
  }
};
