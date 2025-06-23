<template>
  <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Đang xử lý đăng nhập...</h2>

    <p class="text-gray-600 mb-6" v-if="loading">Vui lòng chờ trong giây lát. Hệ thống đang xác thực thông tin của bạn.</p>

    <p class="text-green-600 font-semibold mb-4 text-lg animate-pulse" v-if="success">{{ successMessage }}</p>
    <p class="text-red-600 font-semibold mb-4 text-lg animate-fade-in" v-if="error">{{ error }}</p>

    <div v-if="loading" class="mt-6 flex justify-center">
      <svg class="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { handleAuthCallback, fetchLoggedInUser } from '@/services/authService';

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const success = ref(false);
const successMessage = ref('');
const error = ref(null);

onMounted(async () => {
  try {
    const queryParams = new URLSearchParams(window.location.search);
    const authResult = await handleAuthCallback(queryParams);

    if (authResult && authResult.token) {
      success.value = true;
      successMessage.value = 'Đăng nhập thành công! Đang chuyển hướng...';

      try {
        await fetchLoggedInUser();
      } catch (fetchErr) {
        console.warn("Failed to fetch full user info after login:", fetchErr.message);
      }

      router.replace({ path: route.path, query: {} });

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } else {
      error.value = 'Không nhận được token xác thực.';
    }
  } catch (err) {
    error.value = err.message || 'Đã xảy ra lỗi trong quá trình xác thực.';
    setTimeout(() => {
      router.push({ name: 'login', query: { error: error.value } });
    }, 2000);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Animations are now in main.css */
</style>