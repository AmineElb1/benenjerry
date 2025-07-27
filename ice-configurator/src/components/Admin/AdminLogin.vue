<template>
  <div class="admin-login-fullscreen">
    <img src="/logo.png" alt="Ben & Jerry's Logo" class="admin-logo" />
    <form class="admin-login-form" @submit.prevent="handleLogin">
      <h2>Admin Login</h2>
      <input v-model="username" placeholder="Gebruikersnaam" autocomplete="username" />
      <input v-model="password" type="password" placeholder="Wachtwoord" autocomplete="current-password" />
      <div v-if="error" class="login-error">Onjuiste gegevens</div>
      <button type="submit">Inloggen</button>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const username = ref('')
const password = ref('')
const error = ref(false)
const router = useRouter()
function handleLogin() {
  if (username.value === 'admin' && password.value === 'admin123') {
    error.value = false
    router.push('/admin/dashboard')
  } else {
    error.value = true
  }
}
</script>
<style scoped>
.admin-login-fullscreen {
  min-height: 100vh;
  min-width: 100vw;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
.admin-logo {
  max-width: 180px;
  width: 30vw;
  margin-bottom: 2.2rem;
  display: block;
}
.admin-login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  background: none;
  box-shadow: none;
  padding: 0;
  margin: 0;
}
.admin-login-form h2 {
  margin-bottom: 0.2rem;
  font-size: 1.7rem;
  color: #2d2d2d;
  font-weight: 700;
  text-align: center;
}
.admin-login-form input {
  width: 320px;
  max-width: 90vw;
  padding: 0.7rem 1rem;
  border-radius: 7px;
  border: 1.5px solid #cce3f6;
  font-size: 1.1rem;
  background: #f7fbff;
  transition: border-color 0.2s;
  color: #222;
}
.admin-login-form input:focus {
  border-color: #6ec6f7;
  outline: none;
}
.login-error {
  color: #ff4757;
  font-size: 1em;
  font-weight: 500;
}
.admin-login-form button {
  background: linear-gradient(90deg, #6ec6f7 0%, #2ecc40 100%);
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 0.7rem 2.2rem;
  font-size: 1.15rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(46,204,64,0.08);
  transition: background 0.2s, transform 0.2s;
}
.admin-login-form button:hover {
  background: linear-gradient(90deg, #2ecc40 0%, #6ec6f7 100%);
  transform: translateY(-2px) scale(1.04);
}
@media (max-width: 600px) {
  .admin-logo {
    max-width: 120px;
    width: 60vw;
    margin-bottom: 1.2rem;
  }
  .admin-login-form input {
    width: 90vw;
    max-width: 98vw;
  }
  .admin-login-form {
    gap: 0.8rem;
  }
  .admin-login-form h2 {
    font-size: 1.1rem;
  }
  .admin-login-form button {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
  }
}
</style> 