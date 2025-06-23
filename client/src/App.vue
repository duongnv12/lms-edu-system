<script setup>
import { RouterView, useRoute } from 'vue-router';
import { onMounted, computed } from 'vue';
import { fetchLoggedInUser, getStoredAuthInfo } from '@/services/authService';

import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';

const route = useRoute();

const isAuthPage = computed(() => {
  return route.name === 'login' || route.name === 'auth-callback';
});

onMounted(async () => {
  const auth = getStoredAuthInfo();
  if (auth && auth.token) {
    try {
      await fetchLoggedInUser();
    } catch (err) {
      console.error("[App.vue] Failed to re-fetch user on app load:", err);
    }
  }
});
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col font-sans text-gray-800">
    <TheHeader />

    <main :class="{
        'flex-grow flex items-center justify-center': isAuthPage, /* Trang Auth: căn giữa nội dung */
        'flex-grow container mx-auto p-6 md:p-8': !isAuthPage /* Trang khác: container, padding, nhưng không có bg-white */
      }">
      <RouterView />
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
/* Không cần style scoped phức tạp ở đây nữa */
</style>