import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import CustomerApp from './CustomerApp.vue'
import AdminLogin from './components/Admin/AdminLogin.vue'
import AdminDashboard from './components/Admin/AdminDashboard.vue'

const routes = [
  { path: '/', component: CustomerApp },
  { path: '/admin', component: AdminLogin },
  { path: '/admin/dashboard', component: AdminDashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')
