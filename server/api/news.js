import axios from 'axios';
import { parseString } from 'xml2js';
import { promisify } from 'util';
import { decode } from 'html-entities';

const parseXml = promisify(parseString);

const fetchWithRetry = async (url, retries, delay, timeout) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url, { timeout });
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

function extractImages(item) {
  let images = [];

  if (item.enclosure) {
    images = item.enclosure.map(enc => ({
      url: enc.$.url,
      type: enc.$.type
    }));
  }

  if (item['rbc_news:related_links'] && item['rbc_news:related_links'][0] && item['rbc_news:related_links'][0].link) {
    item['rbc_news:related_links'][0].link.forEach(link => {
      if (link['rbc_news:thumbnail'] && link['rbc_news:thumbnail'][0]) {
        images.push({
          url: link['rbc_news:thumbnail'][0].url[0],
          type: link['rbc_news:thumbnail'][0].type[0],
          description: link['rbc_news:thumbnail'][0].source ? decode(link['rbc_news:thumbnail'][0].source[0]) : null
        });
      }
    });
  }

  return images;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  try {
    const response = await fetchWithRetry(
      config.public.newsRssUrl,
      config.apiRetries,
      config.apiRetryDelay,
      config.apiTimeout
    );
    const result = await parseXml(response.data);
    
    const newsItems = result.rss.channel[0].item.map(item => {
      const processedItem = {
        title: decode(item.title[0]),
        link: item.link[0],
        pubDate: item.pubDate[0],
        description: decode(item.description[0]),
        category: item.category ? item.category[0] : null,
        author: item.author ? item.author[0] : null,
        'rbc_news:full-text': item['rbc_news:full-text'] ? decode(item['rbc_news:full-text'][0]) : null,
        images: extractImages(item),
        'rbc_news:tags': item['rbc_news:tag'] ? item['rbc_news:tag'].map(tag => decode(tag)) : [],
        'rbc_news:anons': item['rbc_news:anons'] ? decode(item['rbc_news:anons'][0]) : null,
        'rbc_news:news_id': item['rbc_news:news_id'] ? item['rbc_news:news_id'][0] : null,
        'rbc_news:type': item['rbc_news:type'] ? item['rbc_news:type'][0] : null,
        'rbc_news:newsDate_timestamp': item['rbc_news:newsDate_timestamp'] ? item['rbc_news:newsDate_timestamp'][0] : null,
        'rbc_news:newsModifDate': item['rbc_news:newsModifDate'] ? item['rbc_news:newsModifDate'][0] : null,
        'rbc_news:newsline': item['rbc_news:newsline'] ? item['rbc_news:newsline'][0] : null,
      };
      
      console.log('Processed item images:', processedItem.images);
      return processedItem;
    });

    console.log('Total news items:', newsItems.length);
    console.log('First item images:', newsItems[0].images);

    return newsItems;
  } catch (error) {
    console.error('Error fetching news:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: `Error fetching news: ${error.message}`,
    });
  }
});