<template>
    <div class="controls-panel">
      <div class="logo-container">
        <img src="/logo.png" alt="Ben & Jerry's Logo" class="benjerry-logo" />
      </div>
      <div class="panel-header">
        <p class="subtitle">Kies je favoriete smaakcombinatie</p>
      </div>
      
      <div class="flavor-section">
        <h3 class="section-title">Hoofdsmaak</h3>
        <div class="flavor-grid">
          <FlavorButton
            v-for="flavor in mainFlavors"
            :key="flavor.name"
            :flavor="flavor"
            :active="selectedFlavor === flavor.name"
            @click="$emit('select-flavor', flavor)"
          />
        </div>
      </div>
      
      <div class="flavor-section">
        <h3 class="section-title">Toppings</h3>
        <div class="flavor-grid">
          <FlavorButton
            v-for="topping in toppings"
            :key="topping.name"
            :flavor="topping"
            :active="selectedTopping && selectedTopping.name === topping.name"
            @click="$emit('select-topping', topping)"
          />
        </div>
      </div>
      
      <div class="button-row">
        <button class="reset-button" @click="$emit('reset')">
          <span>Opnieuw beginnen</span>
        </button>
        <button class="order-button" @click="$emit('order')">
          <span>Bestellen</span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import FlavorButton from './FlavorButton.vue'
  
  defineProps({
    mainFlavors: Array,
    toppings: Array,
    selectedFlavor: String,
    selectedTopping: Object
  })
  
  defineEmits(['select-flavor', 'select-topping', 'reset', 'order'])
  </script>
  
  <style scoped>
  .controls-panel {
    width: 28%;
    height: 100vh;
    padding: 1.2rem 1rem;
    background: white;
    box-shadow: -5px 0 15px rgba(0,0,0,0.05);
    overflow-y: auto;
  }
  .logo-container {
    text-align: center;
    margin-bottom: 1rem;
  }
  .benjerry-logo {
    max-width: 120px;
    width: 70%;
    height: auto;
    display: inline-block;
  }
  
  .panel-header {
    margin-bottom: 1.2rem;
    text-align: center;
  }
  
  .panel-header h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    color: #666;
    font-size: 0.95rem;
  }
  
  .flavor-section {
    margin-bottom: 1.1rem;
  }
  
  .section-title {
    font-size: 1.05rem;
    color: #444;
    margin-bottom: 0.7rem;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid #eee;
  }
  
  .flavor-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .current-selection {
    margin-top: 2rem;
    padding: 1rem;
    background: #f8f8f8;
    border-radius: 8px;
    text-align: center;
  }
  
  .toppings-list {
    margin: 0.5rem 0;
  }
  
  .topping-tag {
    display: inline-block;
    background: #eee;
    padding: 0.2rem 0.5rem;
    border-radius: 50px;
    margin: 0.2rem;
    font-size: 0.8rem;
  }
  
  .button-row {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    margin-top: 1.2rem;
    align-items: center;
  }
  .reset-button, .order-button {
    padding: 0.5rem 1.1rem;
    font-size: 1rem;
  }
  .order-button {
    background: #2ecc40;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(46, 204, 64, 0.2);
  }
  .order-button:hover {
    background: #27ae60;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(46, 204, 64, 0.3);
  }
  .reset-button {
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
  }
  .reset-button:hover {
    background: #ff6b81;
    transform: translateY(-2px);
  }
  
  @media (max-width: 1024px) {
    .controls-panel {
      width: 40%;
    }
    
    .flavor-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .controls-panel {
      width: 100%;
      height: 40vh;
      box-shadow: 0 -5px 15px rgba(0,0,0,0.05);
    }
    
    .flavor-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  @media (max-width: 480px) {
    .controls-panel {
      height: 50vh;
    }
    
    .flavor-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  </style>