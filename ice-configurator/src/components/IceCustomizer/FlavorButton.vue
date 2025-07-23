<template>
    <button 
      class="flavor-button"
      :class="{ 'active': active }"
      :style="{ '--flavor-color': flavor.color }"
      @click="$emit('click')"
      :title="flavor.name"
    >
      <span class="flavor-name">{{ flavor.name }}</span>
    </button>
  </template>
  
  <script setup>
  defineProps({
    flavor: Object,
    active: Boolean
  })
  
  defineEmits(['click'])
  </script>
  
  <style scoped>
  .flavor-button {
    position: relative;
    height: 54px;
    border-radius: 8px;
    border: none;
    background: var(--flavor-color);
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  }
  
  .flavor-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  
  .flavor-button.active {
    transform: scale(1.05);
    box-shadow: 0 0 0 3px white, 0 0 0 6px var(--flavor-color);
  }
  
  .flavor-name {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 0.3rem;
    font-size: 0.7rem;
    text-align: center;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }
  
  .flavor-button:hover .flavor-name {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    .flavor-button {
      height: 40px;
    }
  }
  </style>