<template>
  <div class="order-detail-fullscreen">
    <header class="order-detail-header">
      <img src="/logo.png" alt="Ben & Jerry's Logo" class="admin-logo" />
      <button class="back-btn" @click="goBack">← Terug</button>
    </header>
    <div class="order-detail-content">
      <div v-if="loading" class="order-loading">Laden...</div>
      <div v-else-if="order">
        <h2>Bestelling detail</h2>
        <div class="order-info">
          <p><b>Naam:</b> {{ order.name }}</p>
          <p><b>Adres:</b> {{ order.address }}</p>
          <p><b>Email:</b> {{ order.email }}</p>
          <p><b>Smaak:</b> {{ order.flavor }}</p>
          <p><b>Topping:</b> {{ order.topping }}</p>
          <p><b>Status:</b> {{ order.status }}</p>
          <p><b>Datum:</b> {{ new Date(order.createdAt).toLocaleString() }}</p>
        </div>
      </div>
      <div v-else class="order-not-found">Bestelling niet gevonden.</div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const order = ref(null)
const loading = ref(true)

async function fetchOrder() {
  loading.value = true
  try {
    const res = await fetch(`http://localhost:5000/api/orders/${route.params.id}`)
    if (res.ok) {
      order.value = await res.json()
    } else {
      order.value = null
    }
  } catch (e) {
    order.value = null
  }
  loading.value = false
}
function goBack() {
  router.back()
}
onMounted(fetchOrder)
</script>
<style scoped>
.order-detail-fullscreen {
  min-height: 100vh;
  min-width: 100vw;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}
.order-detail-header {
  width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 2.5rem 1.2rem 2.5rem;
  box-sizing: border-box;
  position: relative;
}
.admin-logo {
  max-width: 180px;
  width: 30vw;
  display: block;
}
.back-btn {
  background: #f5f7fa;
  color: #222;
  border: none;
  border-radius: 30px;
  padding: 0.7rem 2.2rem;
  font-size: 1.15rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: 1.5rem;
  transition: background 0.2s;
}
.back-btn:hover {
  background: #e4e8eb;
}
.order-detail-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  background: none;
  box-shadow: none;
  padding: 0;
  margin: 0;
  margin-top: 2.5rem;
}
.order-detail-content h2 {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.7rem;
  color: #2d2d2d;
  font-weight: 700;
}
.order-info {
  background: #fff;
  border-radius: 1.1rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.09);
  padding: 2.2rem 2rem 1.5rem 2rem;
  min-width: 320px;
  max-width: 420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.order-info p {
  margin: 0.7rem 0;
  font-size: 1.15rem;
  color: #222;
  letter-spacing: 0.01em;
}
.order-loading, .order-not-found {
  margin-top: 2rem;
  font-size: 1.1rem;
  color: #888;
}
@media (max-width: 600px) {
  .order-detail-header {
    padding: 0.7rem 0.7rem 0.7rem 0.7rem;
  }
  .admin-logo {
    max-width: 120px;
    width: 40vw;
  }
  .back-btn {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
  }
  .order-detail-content h2 {
    font-size: 1.1rem;
  }
  .order-info {
    min-width: 0;
    max-width: 98vw;
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    border-radius: 0.7rem;
  }
}
</style> 