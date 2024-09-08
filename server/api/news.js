import axios from 'axios';
import { parseString } from 'xml2js';
import { promisify } from 'util';
import { decode } from 'html-entities';

const parseXml = promisify(parseString);

const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url, { timeout: 5000 });
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export default defineEventHandler(async (event) => {
  try {
    const response = await fetchWithRetry('http://static.feed.rbc.ru/rbc/logical/footer/news.rss');
    const result = await parseXml(response.data);
    
    const newsItems = result.rss.channel[0].item.map(item => ({
      title: decode(item.title[0]),
      link: item.link[0],
      pubDate: item.pubDate[0],
      description: decode(item.description[0]),
      category: item.category ? item.category[0] : null,
      author: item.author ? item.author[0] : null,
      'rbc_news:full-text': item['rbc_news:full-text'] ? decode(item['rbc_news:full-text'][0]) : null,
      images: item.enclosure ? [item.enclosure[0].$.url] : [],
      'rbc_news:image': item['rbc_news:image'] ? {
        url: item['rbc_news:image'][0]['rbc_news:url'][0],
        description: item['rbc_news:image'][0]['rbc_news:description'] ? decode(item['rbc_news:image'][0]['rbc_news:description'][0]) : null,
      } : null,
      'rbc_news:related_links': item['rbc_news:related_links'] ? item['rbc_news:related_links'][0].link.map(link => ({
        url: link.$.url,
        title: decode(link['rbc_news:title'][0]),
        thumbnail: link['rbc_news:thumbnail'] ? {
          url: link['rbc_news:thumbnail'][0].url[0],
          description: link['rbc_news:thumbnail'][0].description ? decode(link['rbc_news:thumbnail'][0].description[0]) : null,
        } : null,
      })) : [],
    }));

    return newsItems;
  } catch (error) {
    console.error('Error fetching news:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: `Error fetching news: ${error.message}`,
    });
  }
});