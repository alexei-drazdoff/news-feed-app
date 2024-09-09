<template>
  <v-container>
    <MetaTags
      title="News Feed App - Последние новости РБК"
      description="Оставайтесь в курсе последних событий в мире финансов и экономики."
      :url="siteUrl"
    />
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field v-model="searchQuery" label="Найти новость" @input="updateFilters"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-date-picker v-model="selectedDate" @input="updateFilters"></v-date-picker>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="item in paginatedItems" :key="item.link" cols="12">
        <v-card class="d-flex flex-column mb-4">
          <div v-if="item.images && item.images.length > 0" class="image-container">
            <v-img :src="getImageUrl(item.images[0])" :alt="item.title" height="200" cover class="news-image"></v-img>
          </div>
          <div class="pa-4 content-wrapper">
            <v-card-title class="text-h6 font-weight-bold title-wrapper">
              <a @click.prevent="navigateToArticle(item.link)" :href="`/news/${encodeURIComponent(item.link)}`"
                class="text-decoration-none">
                {{ item.title }}
              </a>
            </v-card-title>
            <v-card-subtitle class="py-2">
              {{ formatDate(item.pubDate) }}
              <span v-if="item.author" class="ml-2">| {{ item.author }}</span>
              <span v-if="item.category" class="ml-2">| {{ item.category }}</span>
            </v-card-subtitle>
            <v-card-text>
              <p class="text-body-2 description-wrapper">{{ item.description }}</p>
            </v-card-text>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-pagination v-model="currentPage" :length="totalPages" @update:model-value="changePage"></v-pagination>
    <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
    <v-alert v-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNewsStore } from '@/store/newsStore';
import { getNews } from '@/services/newsService';
import { useNewsFilters } from '@/composables/useNewsFilters';
import { usePagination } from '@/composables/usePagination';
import { formatDate } from '@/utils/dateFormatter';
import type { NewsItem } from '@/types/news';
import { useRuntimeConfig } from '#app';
import MetaTags from '@/components/MetaTags.vue';

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl;

const route = useRoute();
const currentUrl = computed(() => `${window.location.origin}${route.fullPath}`);
const router = useRouter();
const newsStore = useNewsStore();

const news = ref<NewsItem[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const { searchQuery, selectedDate, filteredNews, updateFilters } = useNewsFilters(news);
const { currentPage, paginatedItems, totalPages, setPage } = usePagination(filteredNews, 5);

const fetchNews = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    news.value = await getNews();
  } catch (err) {
    console.error('Error fetching news:', err);
    error.value = 'Failed to load news. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

const navigateToArticle = (link: string) => {
  newsStore.setLastVisitedPage(currentPage.value);
  router.push(`/news/${encodeURIComponent(link)}`);
};

const getImageUrl = (image: string | { url: string } | undefined) => {
  if (!image) return '';
  return typeof image === 'string' ? image : image.url;
};

const changePage = (page: number) => {
  setPage(page);
  newsStore.setLastVisitedPage(page);
  router.push({ query: { ...route.query, page: page.toString() } });
};

onMounted(() => {
  fetchNews();
  const pageQuery = route.query.page;
  if (pageQuery) {
    setPage(parseInt(pageQuery as string) || newsStore.lastVisitedPage);
  } else {
    setPage(newsStore.lastVisitedPage);
  }
});

watch(() => route.query.page, (newPage) => {
  if (newPage) {
    setPage(parseInt(newPage as string) || newsStore.lastVisitedPage);
  } else {
    setPage(newsStore.lastVisitedPage);
  }
});

</script>

<style scoped>
.v-card-title a {
  text-decoration: none;
  color: inherit;
}

.v-card-title a:hover {
  opacity: 0.8;
}

.image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.title-wrapper {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}

.description-wrapper {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

@media (min-width: 600px) {
  .v-card {
    flex-direction: row;
  }

  .image-container {
    flex: 0 0 200px;
    height: auto;
  }

  .content-wrapper {
    flex: 1;
  }
}
</style>