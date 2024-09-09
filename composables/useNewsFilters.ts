import { ref, computed } from 'vue';
import type { NewsItem } from '@/types/news';

export function useNewsFilters(news: Ref<NewsItem[]>) {
  const searchQuery = ref('');
  const selectedDate = ref<string | null>(null);

  const filteredNews = computed(() => {
    return news.value.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchesDate = !selectedDate.value || isSameDay(new Date(item.pubDate), new Date(selectedDate.value));
      return matchesSearch && matchesDate;
    });
  });

  const updateFilters = () => {
    // This functio explicitly defined, it doesn't need to do anything
    // as the computed property 'filteredNews' will automatically update
  };

  return {
    searchQuery,
    selectedDate,
    filteredNews,
    updateFilters,
  };
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
