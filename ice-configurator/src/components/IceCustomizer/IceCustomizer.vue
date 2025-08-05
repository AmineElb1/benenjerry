<template>
  <div class="ice-cream-customizer">
    <IceScene 
      ref="iceScene"
      :selected-flavor="selectedFlavor"
      :selected-topping="selectedTopping"
    />
    <FlavorPanel
      :main-flavors="mainFlavors"
      :toppings="toppings"
      :selected-flavor="selectedFlavor"
      :selected-topping="selectedTopping"
      @select-flavor="setFlavor"
      @select-topping="setTopping"
      @reset="resetSelection"
      @order="showOrderForm = true"
    />
    
    
    <div v-if="showOrderForm && !orderSuccess" class="order-form-overlay">
      <form class="order-form" @submit.prevent="submitOrder">
        <div class="order-form-logo">
          <img src="/logo.png" alt="Ben & Jerry's Logo" />
        </div>
        <h2>Bestelgegevens</h2>
        <div class="order-form-fields">
          <div class="order-form-group">
            <label for="name">Naam</label>
            <input id="name" v-model="customer.name" :class="{ error: errors.name }" placeholder="Jouw naam" autocomplete="name" />
            <span v-if="errors.name" class="form-error">Naam is verplicht</span>
          </div>
          <div class="order-form-group">
            <label for="address">Adres</label>
            <input id="address" v-model="customer.address" :class="{ error: errors.address }" placeholder="Straatnaam 123, Stad" autocomplete="street-address" />
            <span v-if="errors.address" class="form-error">Adres is verplicht</span>
          </div>
          <div class="order-form-group">
            <label for="email">E-mail</label>
            <input id="email" v-model="customer.email" :class="{ error: errors.email }" placeholder="jij@email.com" type="email" autocomplete="email" />
            <span v-if="errors.email" class="form-error">Voer een geldig e-mailadres in</span>
          </div>
        </div>
        <div class="order-form-actions">
          <button type="button" class="btn-secondary" @click="showOrderForm = false">Annuleren</button>
          <button type="submit" class="btn-primary">Bestelling plaatsen</button>
        </div>
      </form>
    </div>
    
    <div v-if="orderSuccess" class="order-confirmation">
      <div class="checkmark-container">
        <svg class="checkmark" viewBox="0 0 52 52">
          <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16"/>
        </svg>
      </div>
      <h2>Bedankt voor je bestelling!</h2>
      <p>Je bestellingsnummer is: <b>{{ orderId }}</b></p>
      <button @click="resetOrder">Nieuwe bestelling</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IceScene from './IceScene.vue'
import FlavorPanel from './FlavorPanel.vue'

const selectedFlavor = ref('Vanille')
const selectedTopping = ref(null)

const showOrderForm = ref(false)
const orderSuccess = ref(false)
const orderId = ref('')
const customer = ref({ name: '', address: '', email: '' })
const errors = ref({ name: false, address: false, email: false })

const mainFlavors = [
  { name: 'Chocolade', color: '#6b3e26' },
  { name: 'Aardbei', color: '#ff4b7b' },
  { name: 'Pistache', color: '#a8e060' },
  { name: 'Vanille', color: '#fff8b0' },
  { name: 'Mango', color: '#ffb347' },
  { name: 'Bubblegum', color: '#c77dff' },
  { name: 'Karamel', color: '#d4a76a' },
  { name: 'Mint', color: '#7fffd4' },
  { name: 'Smurfen', color: '#0099ff' } 
]

const toppings = [
  { name: 'Chocoladesaus', color: '#4a2c12', type: 'sauce' },
  { name: 'Sprinkels', color: '#ff69b4', type: 'sprinkles' },
  { name: 'Noten', color: '#8b4513', type: 'nuts' },
  { name: 'Fruit', color: '#ff4500', type: 'fruit' },
  { name: 'Slagroom', color: '#ffffff', type: 'cream' },
  { name: 'Geen', color: null, none: true }
]

function setFlavor(flavor) {
  if (selectedFlavor.value === flavor.name) {
    selectedFlavor.value = ''
    setTimeout(() => {
      selectedFlavor.value = flavor.name
    }, 0)
  } else {
    selectedFlavor.value = flavor.name
  }
}

function setTopping(topping) {
  if (topping && topping.none) {
    selectedTopping.value = null
    return
  }
  if (selectedTopping.value && selectedTopping.value.name === topping.name) {
    selectedTopping.value = null 
  } else {
    selectedTopping.value = topping
  }
}

function resetSelection() {
  selectedFlavor.value = 'Vanille'
  selectedTopping.value = null
}

function validateEmail(email) {
 
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function submitOrder() {
  
  errors.value = { name: false, address: false, email: false }
  let valid = true
  if (!customer.value.name.trim()) {
    errors.value.name = true
    valid = false
  }
  if (!customer.value.address.trim()) {
    errors.value.address = true
    valid = false
  }
  if (!customer.value.email.trim() || !validateEmail(customer.value.email)) {
    errors.value.email = true
    valid = false
  }
  if (!valid) return

  
  const order = {
    name: customer.value.name,
    address: customer.value.address,
    flavor: selectedFlavor.value,
    topping: selectedTopping.value ? selectedTopping.value.name : '',
    email: customer.value.email
  }
  try {
    const res = await fetch('https://benenjerry.onrender.com/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })
    if (!res.ok) throw new Error('Bestelling plaatsen mislukt')
    const data = await res.json()
    orderId.value = data._id
    orderSuccess.value = true
    showOrderForm.value = false
  } catch (err) {
    alert('Er ging iets mis met bestellen: ' + err.message)
  }
}

function resetOrder() {
  orderSuccess.value = false
  orderId.value = ''
  customer.value = { name: '', address: '', email: '' }
  resetSelection()
}
</script>

<style scoped>
.ice-cream-customizer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
}

@media (max-width: 768px) {
  .ice-cream-customizer {
    flex-direction: column;
  }
}

.summary-badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.2rem 0.8rem;
  border-radius: 1rem;
  color: #222;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.order-form-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.order-form {
  background: #fff;
  padding: 2.2rem 2.2rem 1.5rem 2.2rem;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  min-width: 0;
  max-width: 370px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  position: relative;
}
.order-form-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}
.order-form-logo img {
  max-width: 120px;
  width: 80%;
  height: auto;
  display: block;
}
.order-form h2 {
  margin-bottom: 0.2rem;
  font-size: 1.3rem;
  color: #2d2d2d;
  font-weight: 700;
  text-align: center;
}
.order-form-fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.order-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  width: 100%;
}
.order-form-group label {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.1rem;
}
.order-form-group input {
  padding: 0.5rem 0.8rem;
  border-radius: 7px;
  border: 1.5px solid #b0b8c1;
  font-size: 1rem;
  background: #fff;
  color: #222;
  transition: border-color 0.2s, background 0.2s;
}
.order-form-group input:focus {
  border-color: #2ecc40;
  background: #f7fbff;
  outline: none;
}
.order-form-group input.error {
  border-color: #ff4757;
  background: #fff0f3;
  color: #b00020;
}
.form-error {
  color: #b00020;
  font-size: 1em;
  margin-top: 0.1rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.order-form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;
}
.btn-primary {
  background: linear-gradient(90deg, #6ec6f7 0%, #2ecc40 100%);
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
.btn-primary:hover {
  background: linear-gradient(90deg, #2ecc40 0%, #6ec6f7 100%);
  transform: translateY(-2px) scale(1.04);
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
  .order-form {
    max-width: 98vw;
    min-width: 0;
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    border-radius: 0.7rem;
    gap: 0.7rem;
  }
  .order-form-logo img {
    max-width: 80px;
  }
  .order-form h2 {
    font-size: 1.05rem;
  }
  .order-form-actions button {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
}
.order-confirmation {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  flex-direction: column;
  text-align: center;
}
.order-confirmation h2 {
  margin-bottom: 1rem;
  font-size: 2.1rem;
  color: #2ecc40;
  font-weight: 800;
  letter-spacing: 0.01em;
}
.order-confirmation p {
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 1.5rem;
}
.checkmark-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.2rem;
}
.checkmark {
  width: 80px;
  height: 80px;
  display: block;
}
.checkmark-circle {
  stroke: #2ecc40;
  stroke-width: 4;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-linecap: round;
  animation: strokeCircle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}
.checkmark-check {
  stroke: #2ecc40;
  stroke-width: 4;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke-linecap: round;
  animation: strokeCheck 0.4s 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}
@keyframes strokeCircle {
  100% { stroke-dashoffset: 0; }
}
@keyframes strokeCheck {
  100% { stroke-dashoffset: 0; }
}
.order-confirmation button {
  margin-top: 1.5rem;
}
</style>