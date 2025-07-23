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
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IceScene from './IceScene.vue'
import FlavorPanel from './FlavorPanel.vue'

const selectedFlavor = ref('Vanille')
const selectedTopping = ref(null)

const mainFlavors = [
  { name: 'Chocolade', color: '#6b3e26' },
  { name: 'Aardbei', color: '#ff4b7b' },
  { name: 'Pistache', color: '#a8e060' },
  { name: 'Vanille', color: '#fff8b0' },
  { name: 'Mango', color: '#ffb347' },
  { name: 'Bubblegum', color: '#c77dff' },
  { name: 'Karamel', color: '#d4a76a' },
  { name: 'Mint', color: '#7fffd4' },
]

const toppings = [
  { name: 'Chocoladesaus', color: '#4a2c12', type: 'sauce' },
  { name: 'Sprinkels', color: '#ff69b4', type: 'sprinkles' },
  { name: 'Noten', color: '#8b4513', type: 'nuts' },
  { name: 'Fruit', color: '#ff4500', type: 'fruit' },
  { name: 'Slagroom', color: '#ffffff', type: 'cream' },
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
  if (selectedTopping.value && selectedTopping.value.name === topping.name) {
    selectedTopping.value = null // deselect
  } else {
    selectedTopping.value = topping
  }
}

function resetSelection() {
  selectedFlavor.value = 'Vanille'
  selectedTopping.value = null
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
</style>