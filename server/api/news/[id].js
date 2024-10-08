import axios from 'axios';
import { parseString } from 'xml2js';
import { promisify } from 'util';
import { decode } from 'html-entities'; 

const parseXml = promisify(parseString);

function extractImages(item) {
  let images = [];

  if (item.enclosure) {
    images = item.enclosure.map(enc => ({
      url: enc.$.url,
      type: enc.$.type,
      description: null
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
  const id = decodeURIComponent(event.context.params.id);

  try {
    const response = await axios.get(config.public.newsRssUrl, { 
      timeout: config.apiTimeout 
    });
    const result = await parseXml(response.data);
    
    console.log('RSS feed parsed, searching for news item');
    if (!result.rss || !result.rss.channel || !result.rss.channel[0] || !result.rss.channel[0].item) {
      console.error('Unexpected RSS structure:', JSON.stringify(result, null, 2));
      throw createError({
        statusCode: 500,
        statusMessage: 'Unexpected RSS structure',
      });
    }

    const newsItem = result.rss.channel[0].item.find(item => item.link && item.link[0] === id);

    if (!newsItem) {
      console.error('News item not found for id:', id);
      throw createError({
        statusCode: 404,
        statusMessage: 'News item not found',
      });
    }

    console.log('News item found, processing data');
    
    const images = extractImages(newsItem);

    return {
      title: newsItem.title ? decode(newsItem.title[0]) : null,
      link: newsItem.link ? newsItem.link[0] : null,
      pubDate: newsItem.pubDate ? newsItem.pubDate[0] : null,
      description: newsItem.description ? decode(newsItem.description[0]) : null,
      author: newsItem.author ? decode(newsItem.author[0]) : null,
      'rbc_news:full-text': newsItem['rbc_news:full-text'] ? decode(newsItem['rbc_news:full-text'][0]) : null,
      images: images.filter(image => image.url !== null && image.type.startsWith('image/')),
      category: newsItem.category ? decode(newsItem.category[0]) : null,
      'rbc_news:anons': newsItem['rbc_news:anons'] ? decode(newsItem['rbc_news:anons'][0]) : null,
      'rbc_news:news_id': newsItem['rbc_news:news_id'] ? newsItem['rbc_news:news_id'][0] : null,
      'rbc_news:type': newsItem['rbc_news:type'] ? newsItem['rbc_news:type'][0] : null,
      'rbc_news:newsDate_timestamp': newsItem['rbc_news:newsDate_timestamp'] ? newsItem['rbc_news:newsDate_timestamp'][0] : null,
      'rbc_news:newsModifDate': newsItem['rbc_news:newsModifDate'] ? newsItem['rbc_news:newsModifDate'][0] : null,
      'rbc_news:newsline': newsItem['rbc_news:newsline'] ? newsItem['rbc_news:newsline'][0] : null,
      'rbc_news:tags': newsItem['rbc_news:tag'] ? newsItem['rbc_news:tag'].map(tag => decode(tag)) : [],
    };
  } catch (error) {
    console.error('Error fetching news detail:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Error fetching news detail',
    });
  }
});