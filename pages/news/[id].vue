<template>
  <div>
    <MetaTags
      v-if="news"
      :title="news.title"
      :description="news.description"
      :image="news.images[0]?.url"
      :url="currentUrl"
    />
    <v-container class="py-8">
      <v-card v-if="loading" class="loading-card">
        <v-card-text>
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <span class="ml-2">Loading news article...</span>
        </v-card-text>
      </v-card>

      <v-card v-else-if="error" class="error-card">
        <v-card-text>
          <v-alert type="error" :title="error.title">
            {{ error.message }}
          </v-alert>
        </v-card-text>
      </v-card>

      <v-card v-else-if="news" class="news-card">
        <v-carousel
          v-if="news.images && news.images.length > 0"
          :hide-delimiters="news.images.length === 1"
          :show-arrows="news.images.length > 1 ? 'hover' : false"
          height="400"
          class="mb-4"
        >
          <v-carousel-item
            v-for="(image, i) in news.images"
            :key="i"
            :src="image.url"
            @click="openImageDialog(image.url)"
          >
            <div v-if="image.description" class="image-caption">{{ image.description }}</div>
          </v-carousel-item>
        </v-carousel>

        <v-card-title class="text-h4 font-weight-bold mb-2 title-wrap">{{ news.title }}</v-card-title>
        <v-card-subtitle class="mb-4 text-subtitle-1">
          {{ formatDate(news.pubDate) }}
          <span v-if="news.author" class="ml-2">| {{ news.author }}</span>
          <span v-if="news.category" class="ml-2">| {{ news.category }}</span>
        </v-card-subtitle>
        <v-card-text>
          <p class="text-body-1 font-weight-medium mb-6 news-description">{{ news.description }}</p>
          <div v-html="news['rbc_news:full-text']" class="news-content"></div>
          <v-btn :href="news.link" target="_blank" color="primary" class="mt-8">
            Read on RBC
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>

    <v-dialog v-model="imageDialog" max-width="90vw" max-height="90vh">
      <v-card>
        <v-img :src="selectedImage" contain max-height="90vh">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="imageDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import MetaTags from '@/components/MetaTags.vue';

const route = useRoute();
const news = ref(null);
const loading = ref(true);
const error = ref(null);
const imageDialog = ref(false);
const selectedImage = ref('');
const currentUrl = computed(() => `${window.location.origin}${route.fullPath}`);

const fetchNewsDetail = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(`/api/news/${encodeURIComponent(route.params.id)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    news.value = data;
    console.log('Fetched news data:', data); // Add this line for debugging
  } catch (e) {
    console.error('Error fetching news detail:', e);
    error.value = {
      title: 'Failed to load news article',
      message: 'Please try again later or contact support if the problem persists.'
    };
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Date not available';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'  // Assuming the date is in UTC
  });
};

const openImageDialog = (imageUrl) => {
  selectedImage.value = imageUrl;
  imageDialog.value = true;
};

onMounted(fetchNewsDetail);
</script>

<style scoped>
.loading-card, .error-card {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.news-card {
  max-width: 800px;
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
}

.v-carousel {
  cursor: pointer;
}
</style>
