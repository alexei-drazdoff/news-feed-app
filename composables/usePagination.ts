import { ref, computed } from 'vue';

export function usePagination<T>(items: Ref<T[]>, itemsPerPage: number) {
  const currentPage = ref(1);

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(items.value.length / itemsPerPage);
  });

  const setPage = (page: number) => {
    currentPage.value = page;
  };

  return {
    currentPage,
    paginatedItems,
    totalPages,
    setPage,
  };
}
