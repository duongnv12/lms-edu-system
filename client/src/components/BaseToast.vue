<template>
  <transition name="fade">
    <div v-if="show" :class="['fixed z-50 top-5 right-5 min-w-[280px] max-w-xs shadow-2xl',
      'bg-' + (type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue') + '-100',
      'border', 'border-' + (type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue') + '-400',
      (type === 'success' ? 'text-green-700' : type === 'error' ? 'text-red-700' : 'text-blue-700'),
      'px-4', 'py-3', 'rounded-xl', 'transition-all', 'duration-300', 'animate-fade-in']">
      <div class="flex items-center gap-2">
        <span v-if="type === 'success'" class="material-icons">check_circle</span>
        <span v-else-if="type === 'error'" class="material-icons">error</span>
        <span v-else class="material-icons">info</span>
        <span>{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  message: String,
  type: { type: String, default: 'info' }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.material-icons { font-family: 'Material Icons'; font-style: normal; font-weight: normal; font-size: 20px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; direction: ltr; font-feature-settings: 'liga'; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; }
</style>
