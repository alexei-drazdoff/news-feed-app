export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  category: string | null;
  author: string | null;
  'rbc_news:full-text': string | null;
  images: Array<{
    url: string;
    description?: string;
    type: string;
  }>;
  'rbc_news:tags': string[];
  'rbc_news:anons'?: string;
  'rbc_news:news_id'?: string;
  'rbc_news:type'?: string;
  'rbc_news:newsDate_timestamp'?: string;
  'rbc_news:newsModifDate'?: string;
  'rbc_news:newsline'?: string;
}
