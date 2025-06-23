<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-6 text-center">Liên hệ với chúng tôi</h1>

    <div class="bg-white shadow-lg rounded-lg p-8 mb-8">
      <p class="text-lg text-gray-700 mb-4">
        Nếu bạn có bất kỳ câu hỏi, góp ý, hoặc cần hỗ trợ, xin vui lòng liên hệ với chúng tôi qua các kênh sau:
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-3">Thông tin liên hệ</h2>
          <p class="text-gray-600 mb-2"><strong>Email:</strong> <a href="mailto:support@lms-edu.com" class="text-blue-600 hover:underline">support@lms-edu.com</a></p>
          <p class="text-gray-600 mb-2"><strong>Điện thoại:</strong> +84 123 456 789</p>
          <p class="text-gray-600 mb-2"><strong>Địa chỉ:</strong> Tòa nhà A, Trường Đại học Phenikaa, Yên Nghĩa, Hà Đông, Hà Nội</p>
        </div>
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-3">Giờ làm việc</h2>
          <p class="text-gray-600 mb-2">Thứ Hai - Thứ Sáu: 8:00 AM - 5:00 PM</p>
          <p class="text-gray-600 mb-2">Thứ Bảy, Chủ Nhật và ngày lễ: Đóng cửa</p>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-3">Gửi tin nhắn cho chúng tôi</h2>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Tên của bạn:</label>
            <input type="text" id="name" v-model="form.name"
                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   required>
          </div>
          <div class="mb-4">
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input type="email" id="email" v-model="form.email"
                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   required>
          </div>
          <div class="mb-4">
            <label for="subject" class="block text-gray-700 text-sm font-bold mb-2">Chủ đề:</label>
            <input type="text" id="subject" v-model="form.subject"
                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div class="mb-6">
            <label for="message" class="block text-gray-700 text-sm font-bold mb-2">Nội dung tin nhắn:</label>
            <textarea id="message" v-model="form.message" rows="5"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required></textarea>
          </div>
          <div class="flex items-center justify-between">
            <button type="submit"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Gửi tin nhắn
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const submitForm = () => {
  console.log('Form liên hệ đã gửi:', form);
  alert('Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.');
  form.name = '';
  form.email = '';
  form.subject = '';
  form.message = '';
};
</script>

<style scoped>
/* Có thể thêm các style tùy chỉnh nếu cần */
</style>