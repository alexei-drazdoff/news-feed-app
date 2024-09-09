import { defineStore } from 'pinia';

interface NewsState {
  lastVisitedPage: number;
}

export const useNewsStore = defineStore('news', {
  state: (): NewsState => ({
    lastVisitedPage: 1,
  }),
  actions: {
    setLastVisitedPage(page: number) {
      this.lastVisitedPage = page;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('lastVisitedPage', page.toString());
      }
    },
    initializeLastVisitedPage() {
      if (typeof localStorage !== 'undefined') {
        const storedPage = localStorage.getItem('lastVisitedPage');
        if (storedPage) {
          this.lastVisitedPage = parseInt(storedPage);
        }
      }
    },
  },
});