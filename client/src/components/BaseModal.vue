<template>
  <transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-7xl p-0 relative animate-fade-in border border-blue-100 overflow-hidden">
        <div v-if="title || $slots.header" class="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-4 flex items-center justify-between">
          <slot name="header">
            <h2 class="text-2xl font-bold">{{ title }}</h2>
          </slot>
          <button @click="$emit('close')" class="text-white hover:text-blue-100 text-3xl font-bold focus:outline-none">&times;</button>
        </div>
        <div class="p-8">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({ show: Boolean, title: String });
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.2s ease; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
