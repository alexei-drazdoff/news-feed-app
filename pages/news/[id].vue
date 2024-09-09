<template>
  <div>
    <v-btn
      variant="outlined"
      class="mb-4 back-button"
      @click="goBackToNews"
      aria-label="Back to news list"
    >
      <v-icon start icon="mdi-arrow-left"></v-icon>
      Обратно к новостям
    </v-btn>
    <MetaTags
      v-if="news"
      :title="news.title"
      :description="news.description"
      :image="getImageUrl(news.images[0])"
      :url="currentUrl"
    />
    <v-container class="py-8">
      <v-card v-if="loading" class="loading-card">
        <v-card-text>
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <span class="ml-2">Загружаем новость...</span>
        </v-card-text>
      </v-card>

      <v-card v-else-if="error" class="error-card">
        <v-card-title>{{ error.title }}</v-card-title>
        <v-card-text>{{ error.message }}</v-card-text>
      </v-card>

      <v-card v-else-if="news" class="news-card">
        <v-carousel
          v-if="news && news.images && news.images.length > 0"
          :hide-delimiters="news.images.length === 1"
          :show-arrows="news.images.length > 1 ? 'hover' : false"
          class="mb-4 responsive-carousel"
          height="auto"
        >
          <v-carousel-item
            v-for="(image, i) in news.images"
            :key="i"
            @click="openImageDialog(getImageUrl(image))"
          >
            <v-img
              :src="getImageUrl(image)"
              :aspect-ratio="16/9"
              cover
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
              <div v-if="getImageDescription(image)" class="image-caption">
                {{ getImageDescription(image) }}
              </div>
            </v-img>
          </v-carousel-item>
        </v-carousel>

        <v-card-title class="text-h4 font-weight-bold mb-2 title-wrap">{{ news.title }}</v-card-title>
        <v-card-subtitle class="mb-4 text-subtitle-1">
          {{ formatDate(news.pubDate, true) }}
          <span v-if="news.author" class="ml-2">| {{ news.author }}</span>
          <span v-if="news.category" class="ml-2">| {{ news.category }}</span>
        </v-card-subtitle>
        <v-card-text>
          <p class="text-body-1 font-weight-medium mb-6 news-description">{{ news.description }}</p>
          <div v-html="news['rbc_news:full-text']" class="news-content"></div>
          <v-chip-group v-if="news['rbc_news:tags'].length" class="mt-4">
            <v-chip v-for="tag in news['rbc_news:tags']" :key="tag" small>
              {{ tag }}
            </v-chip>
          </v-chip-group>
          <v-btn :href="news.link" target="_blank" color="secondary" class="mt-8">
            Прочитать на РБК
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>

    <v-dialog v-model="imageDialog" max-width="90vw" max-height="90vh">
      <v-card>
        <NuxtImg
          :src="selectedImage"
          :alt="news?.title"
          width="1200"
          height="675"
          fit="contain"
          loading="lazy"
          class="v-img"
          style="max-height: 90vh;"
        >
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </NuxtImg>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getNewsDetail } from '@/services/newsService';
import { useImageDialog } from '@/composables/useImageDialog';
import { formatDate } from '@/utils/dateFormatter';
import type { NewsItem } from '@/types/news';
import { useNewsStore } from '@/store/newsStore';

const route = useRoute();
const router = useRouter();

const news = ref<NewsItem | null>(null);
const loading = ref(true);
const error = ref<{ title: string; message: string } | null>(null);

const { imageDialog, selectedImage, openImageDialog } = useImageDialog();

const currentUrl = computed(() => `${window.location.origin}${route.fullPath}`);

const fetchNewsDetail = async () => {
  loading.value = true;
  error.value = null;
  try {
    news.value = await getNewsDetail(route.params.id as string);
  } catch (e) {
    console.error('Error fetching news detail:', e);
    error.value = {
      title: 'Failed to load news article',
      message: 'Please try again later or contact support if the problem persists.',
    };
  } finally {
    loading.value = false;
  }
};

onMounted(fetchNewsDetail);

const newsStore = useNewsStore();

const goBackToNews = () => {
  router.push({ path: '/', query: { page: newsStore.lastVisitedPage.toString() } });
};

const getImageUrl = (image: string | { url: string } | undefined) => {
  if (!image) return '';
  return typeof image === 'string' ? image : image.url;
};

const getImageDescription = (image: string | { description?: string }) => {
  return typeof image === 'string' ? null : image.description;
};
</script>

<style scoped>
.loading-card, .error-card {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.news-card {
  max-width: 1200px;
  margin: 0 auto;
}

.title-wrap {
  word-wrap: break-word;
  white-space: normal;
}

.news-description {
  font-size: 1.1em;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 2em;
}

.news-content {
  font-size: 1em;
  line-height: 1.6;
}

.news-content p {
  margin-bottom: 1.5em;
}

.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px;
  font-size: 14px;
  z-index: 1;
}

.v-carousel {
  cursor: pointer;
}

.v-carousel .v-window__container {
  height: auto !important;
}

.v-carousel-item {
  height: auto !important;
}

.v-img {
  max-height: 600px;
}

@media (max-width: 960px) {
  .v-img {
    max-height: 400px;
  }
}

@media (max-width: 600px) {
  .v-img {
    max-height: 300px;
  }
}

.back-button {
  position: fixed;
  top: 80px; 
  left: 20px;
  z-index: 1000;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.back-button:hover {
  opacity: 1;
}

@media (max-width: 600px) {
  .back-button {
    top: auto;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.v-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
