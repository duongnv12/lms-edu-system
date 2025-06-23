<template>
  <div class="login-bg min-h-screen w-screen flex items-center justify-center">
    <div class="w-full max-w-2xl bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl px-12 py-12 border border-blue-100">
      <img src="/logo.png" alt="LMS Logo" class="mx-auto h-20 mb-7 drop-shadow-md">
      <h2 class="text-3xl font-extrabold mb-10 text-gray-800 text-center tracking-tight">Chào mừng đến với LMS Edu System</h2>

      <transition name="fade">
        <p v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-center shadow animate-fade-in">
          {{ errorMessage }}
        </p>
      </transition>

      <form @submit.prevent="handleTraditionalLogin" class="mb-7 space-y-6">
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
            <!-- Material Design Email Icon -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </span>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 transition text-lg"
            required
            autocomplete="username"
          />
        </div>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
            <!-- Material Design Lock Icon -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="5" y="11" width="14" height="8" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M12 17v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </span>
          <input
            v-model="password"
            type="password"
            placeholder="Mật khẩu"
            class="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 transition text-lg"
            required
            autocomplete="current-password"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out flex items-center justify-center text-lg"
        >
          <span v-if="loading" class="animate-spin mr-2">⏳</span>
          Đăng nhập
        </button>
      </form>

      <div class="my-5 flex items-center justify-center">
        <span class="h-px flex-1 bg-gray-300"></span>
        <span class="px-4 text-gray-500 text-base">hoặc</span>
        <span class="h-px flex-1 bg-gray-300"></span>
      </div>

      <button
        @click="handleGoogleLogin"
        class="w-full bg-white hover:bg-blue-50 border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-3 shadow transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 text-lg"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" class="h-6 w-6">
        <span class="text-base font-medium">Đăng nhập với Google</span>
      </button>

      <p class="text-xs text-gray-600 mt-8 leading-relaxed text-center">
        <span class="font-medium text-blue-700">Sử dụng tài khoản nội bộ của Phenikaa University</span>.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { initiateGoogleLogin, setAuthInfo, fetchLoggedInUser } from '@/services/authService';

const route = useRoute();
const router = useRouter();
const errorMessage = ref(null);

const email = ref('');
const password = ref('');
const loading = ref(false);

onMounted(() => {
  if (route.query.error) {
    errorMessage.value = route.query.error;
  }
});

const handleGoogleLogin = () => {
  errorMessage.value = null;
  initiateGoogleLogin();
};

const handleTraditionalLogin = async () => {
  errorMessage.value = null;
  loading.value = true;
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      throw new Error('Lỗi máy chủ: Không nhận được dữ liệu hợp lệ.');
    }

    if (!res.ok) {
      throw new Error(data?.message || 'Đăng nhập thất bại.');
    }
    setAuthInfo(data);
    try {
      await fetchLoggedInUser();
    } catch (e) {}
    router.replace('/');
  } catch (err) {
    errorMessage.value = err.message || 'Đăng nhập thất bại.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  min-width: 100vw;
  background: linear-gradient(135deg, #e0e7ff 0%, #fff 50%, #bae6fd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>