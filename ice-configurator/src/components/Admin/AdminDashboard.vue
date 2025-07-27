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
              <th>Smaak</th>
              <th>Topping</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order._id">
              <td>{{ order.name }}</td>
              <td>{{ order.flavor }}</td>
              <td>{{ order.topping }}</td>
              <td>
                <select v-model="order.status" @change="updateStatus(order)">
                  <option value="te verwerken">Te verwerken</option>
                  <option value="verzonden">Verzonden</option>
                  <option value="geannuleerd">Geannuleerd</option>
                </select>
              </td>
              <td>
                <button @click="goToDetail(order._id)" class="details-btn">Details</button>
              </td>
              <td>
                <button @click="openDeleteModal(order)" class="delete-btn">Verwijderen</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="no-orders">Geen bestellingen gevonden.</div>
      </div>
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal">
          <h3>Weet je zeker dat je deze bestelling wilt verwijderen?</h3>
          <div class="modal-actions">
            <button class="btn-secondary" @click="closeDeleteModal">Annuleren</button>
            <button class="btn-danger" @click="confirmDelete">Verwijderen</button>
          </div>
        </div>
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
const showDeleteModal = ref(false)
const orderToDelete = ref(null)

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

function openDeleteModal(order) {
  orderToDelete.value = order
  showDeleteModal.value = true
}
function closeDeleteModal() {
  orderToDelete.value = null
  showDeleteModal.value = false
}
async function confirmDelete() {
  if (!orderToDelete.value) return
  try {
    await fetch(`http://localhost:5000/api/orders/${orderToDelete.value._id}`, { method: 'DELETE' })
    orders.value = orders.value.filter(o => o._id !== orderToDelete.value._id)
  } catch (e) {
    alert('Verwijderen mislukt')
  }
  closeDeleteModal()
}

async function updateStatus(order) {
  try {
    await fetch(`http://localhost:5000/api/orders/${order._id}/status`, {
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
function goToDetail(id) {
  router.push(`/admin/orders/${id}`)
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
  margin-left: 0.7rem;
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
.details-btn {
  background: #2ecc40;
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 0.4rem 1.1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.details-btn:hover {
  background: #27ae38;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal {
  background: #fff;
  border-radius: 1.1rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.13);
  padding: 2rem 2.2rem 1.5rem 2.2rem;
  min-width: 280px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal h3 {
  margin-bottom: 1.2rem;
  font-size: 1.15rem;
  color: #2d2d2d;
  text-align: center;
}
.modal-actions {
  display: flex;
  gap: 1.2rem;
  margin-top: 0.5rem;
}
.btn-danger {
  background: #ff4757;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(46,204,64,0.08);
  transition: background 0.2s, transform 0.2s;
}
.btn-danger:hover {
  background: #ff6b81;
}
.btn-secondary {
  background: #fff;
  color: #2ecc40;
  border: 2px solid #2ecc40;
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-secondary:hover {
  background: #2ecc40;
  color: #fff;
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