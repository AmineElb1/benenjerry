<template>
  <div class="admin-dashboard-fullscreen">
    <header class="admin-dashboard-header">
      <img src="/logo.png" alt="Ben & Jerry's Logo" class="admin-logo" />
      <button class="logout-btn" @click="logout">Uitloggen</button>
    </header>
    <div class="admin-dashboard-content">
      <h2>Admin Dashboard</h2>
      <div v-if="loading" class="admin-loading">Laden...</div>
      <div v-else>
        <table class="orders-table" v-if="orders.length">
          <thead>
            <tr>
              <th>Naam</th>
              <th>Adres</th>
              <th>Smaak</th>
              <th>Topping</th>
              <th>Status</th>
              <th>Datum</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order._id">
              <td>{{ order.name }}</td>
              <td>{{ order.address }}</td>
              <td>{{ order.flavor }}</td>
              <td>{{ order.topping }}</td>
              <td>
                <select v-model="order.status" @change="updateStatus(order)">
                  <option value="te verwerken">Te verwerken</option>
                  <option value="verzonden">Verzonden</option>
                  <option value="geannuleerd">Geannuleerd</option>
                </select>
              </td>
              <td>{{ new Date(order.createdAt).toLocaleString() }}</td>
              <td>
                <button @click="deleteOrder(order._id)" class="delete-btn">Verwijderen</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="no-orders">Geen bestellingen gevonden.</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const orders = ref([])
const loading = ref(true)

async function fetchOrders() {
  loading.value = true
  try {
    const res = await fetch('http://localhost:5000/api/orders')
    orders.value = await res.json()
  } catch (e) {
    alert('Kan bestellingen niet ophalen')
  }
  loading.value = false
}

async function deleteOrder(id) {
  if (!confirm('Weet je zeker dat je deze bestelling wilt verwijderen?')) return
  try {
    await fetch(`http://localhost:5000/api/orders/${id}`, { method: 'DELETE' })
    orders.value = orders.value.filter(o => o._id !== id)
  } catch (e) {
    alert('Verwijderen mislukt')
  }
}

async function updateStatus(order) {
  try {
    await fetch(`http://localhost:5000/api/orders/${order._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: order.status })
    })
  } catch (e) {
    alert('Status bijwerken mislukt')
  }
}

function logout() {
  router.push('/admin')
}

onMounted(fetchOrders)
</script>
<style scoped>
.admin-dashboard-fullscreen {
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
.admin-dashboard-header {
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
.logout-btn {
  background: #ff4757;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 0.7rem 2.2rem;
  font-size: 1.15rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.logout-btn:hover {
  background: #ff6b81;
}
.admin-dashboard-content {
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
.admin-dashboard-content h2 {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.7rem;
  color: #2d2d2d;
  font-weight: 700;
}
.admin-dashboard-content p {
  text-align: center;
  color: #666;
}
input, select, textarea {
  color: #222;
}
.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  background: #fff;
  border-radius: 0.7rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  overflow: hidden;
}
.orders-table th, .orders-table td {
  padding: 0.7rem 1.1rem;
  border-bottom: 1px solid #e4e8eb;
  text-align: left;
  color: #222;
}
.orders-table th {
  background: #f5f7fa;
  font-weight: 700;
}
.orders-table tr:last-child td {
  border-bottom: none;
}
.orders-table select {
  color: #222;
  background: #f5f7fa;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0.3rem 0.7rem;
  font-size: 1rem;
}
.delete-btn {
  background: #ff4757;
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 0.4rem 1.1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.delete-btn:hover {
  background: #ff6b81;
}
.admin-loading {
  margin-top: 2rem;
  font-size: 1.2rem;
  color: #888;
}
.no-orders {
  margin-top: 2rem;
  font-size: 1.1rem;
  color: #888;
}
@media (max-width: 600px) {
  .admin-dashboard-header {
    padding: 0.7rem 0.7rem 0.7rem 0.7rem;
  }
  .admin-logo {
    max-width: 120px;
    width: 40vw;
  }
  .logout-btn {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
  }
  .admin-dashboard-content h2 {
    font-size: 1.1rem;
  }
}
</style> 