<!-- pages/index.vue -->
<template>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="searchQuery" label="Search news" @input="filterNews"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-date-picker v-model="selectedDate" @input="filterNews"></v-date-picker>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="item in paginatedNews" :key="item.link" cols="12">
          <v-card>
            <v-card-title>
              <NuxtLink :to="`/news/${encodeURIComponent(item.link)}`">
                {{ item.title }}
              </NuxtLink>
            </v-card-title>
            <v-card-subtitle>{{ formatDate(item.pubDate) }}</v-card-subtitle>
            <v-card-text>{{ item.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-pagination v-model="currentPage" :length="totalPages" @input="changePage"></v-pagination>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const news = ref([]);
const searchQuery = ref('');
const selectedDate = ref(null);
const currentPage = ref(1);
const itemsPerPage = 5;

const fetchNews = async () => {
  try {
    const response = await fetch('/api/news');
    news.value = await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
  }
};

const filteredNews = computed(() => {
  if (!news.value) return [];
  return news.value
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchesDate = !selectedDate.value || isSameDay(new Date(item.pubDate), new Date(selectedDate.value));
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
});

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredNews.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredNews.value.length / itemsPerPage);
});

const filterNews = () => {
  currentPage.value = 1;
};

const changePage = (page) => {
  currentPage.value = page;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

onMounted(fetchNews);
</script>