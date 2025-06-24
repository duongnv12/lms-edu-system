import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import AuthCallback from '../views/AuthCallback.vue'
import Profile from '../views/Profile.vue';
import { getStoredAuthInfo, logout } from '../services/authService';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: { requiresAuth: true } 
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { requiresAuth: false } 
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            meta: { requiresAuth: true } 
        },
        {
            path: '/auth/callback', 
            name: 'auth-callback',
            component: AuthCallback,
            meta: { requiresAuth: false } 
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/views/About.vue')
        },
        {
            path: '/contact',
            name: 'contact',
            component: () => import('@/views/Contact.vue')
        },
        {
            path: '/privacy',
            name: 'privacy',
            component: () => import('@/views/Privacy.vue')
        },
        {
            path: '/courses',
            name: 'courses',
            component: () => import('@/views/CourseList.vue'),
            meta: { requiresAuth: true } 
        },
        {
            path: '/departments',
            name: 'DepartmentList',
            component: () => import('../views/DepartmentList.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('@/views/Admin.vue'),
            meta: { requiresAuth: true }
        },
    ]
})

// Navigation Guard để bảo vệ các route
router.beforeEach((to, from, next) => {
    console.log(`[ROUTER_GUARD] Navigating to: ${to.path}`);
    const authInfo = getStoredAuthInfo(); // Lấy thông tin đăng nhập từ Local Storage
    const isLoggedIn = !!authInfo && !!authInfo.token; // Kiểm tra xem có token hợp lệ không

    // Nếu route yêu cầu xác thực VÀ người dùng chưa đăng nhập
    if (to.meta.requiresAuth && !isLoggedIn) {
        console.log(`[ROUTER_GUARD] Route ${to.path} requires auth, but user is not logged in. Redirecting to /login.`);
        logout(); // Đảm bảo mọi session cũ được xóa
        next({ name: 'login' }); // Chuyển hướng về trang đăng nhập
    }
    // Nếu người dùng đã đăng nhập VÀ đang cố gắng truy cập trang login/callback
    else if ((to.name === 'login' || to.name === 'auth-callback') && isLoggedIn) {
        console.log(`[ROUTER_GUARD] User already logged in. Redirecting from ${to.path} to /.`);
        next({ name: 'home' }); // Chuyển hướng về trang chủ
    }
    // Cho phép đi tiếp
    else {
        console.log(`[ROUTER_GUARD] Allowing navigation to ${to.path}.`);
        next();
    }
});


export default router