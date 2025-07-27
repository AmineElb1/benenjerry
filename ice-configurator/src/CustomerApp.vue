<template>
  <IceCustomizer />
  <footer class="footer-admin-link">
    <router-link to="/admin">Admin login</router-link>
  </footer>
</template>

<script setup>
import IceCustomizer from './components/IceCustomizer/IceCustomizer.vue'
</script>

<style scoped>
.footer-admin-link {
  position: fixed;
  bottom: 12px;
  right: 18px;
  font-size: 0.93em;
  color: #aaa;
  opacity: 0.7;
  z-index: 2000;
}
.footer-admin-link a {
  color: #aaa;
  text-decoration: underline dotted;
  transition: color 0.2s;
}
.footer-admin-link a:hover {
  color: #2ecc40;
  opacity: 1;
}
</style> 