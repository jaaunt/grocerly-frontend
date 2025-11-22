<script setup>
import { ref } from "vue";
import apiClient from "@/sevices/api.js";
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/auth'

const router = useRouter();
const authStore = useAuthStore()

const user = ref({
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  phone: ""
});
const message = ref("");
const error = ref("");

const registerUser = async () => {
  try {
    const response = await apiClient.post("/register", user.value);
    message.value = "Konto loodud!";
    error.value = "";
    const userData = response.data;
    authStore.login(userData)
    router.push(`/users/${userData.id}`);
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 400) {
      error.value = err.response.data;
    } else {
      error.value = "Registreerimine ebaõnnestus";
    }
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Loo uus kasutaja</h1>

      <form @submit.prevent="registerUser">
        <div class="form-row">
          <div class="form-group">
            <label>Eesnimi</label>
            <input v-model="user.firstName" type="text" placeholder="Eesnimi" required />
          </div>

          <div class="form-group">
            <label>Perekonna nimi</label>
            <input v-model="user.lastName" type="text" placeholder="Perekonna nimi" required />
          </div>
        </div>

        <div class="form-group">
          <label>Kasutajanimi</label>
          <input v-model="user.username" type="text" placeholder="Vali kasutajanimi" required />
        </div>

        <div class="form-group">
          <label>E-mail</label>
          <input v-model="user.email" type="email" placeholder="nimi@email.com" required />
        </div>

        <div class="form-group">
          <label>Parool</label>
          <input v-model="user.password" type="password" placeholder="Vali tugev parool" required />
        </div>

        <div class="form-group">
          <label>Telefon</label>
          <input v-model="user.phone" type="text" placeholder="+372 5xxx xxxx" required />
        </div>

        <button type="submit" class="btn-primary">Registreeri</button>
      </form>

      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>

      <div class="divider">
        <span>või</span>
      </div>

      <p class="login-link">
        On juba konto?
        <a @click="goToLogin">Logi sisse</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-card {
  width: 100%;
  max-width: 480px;
  background: #fff;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.3);
}

h1 {
  margin: 0 0 2rem 0;
  color: #1e3a5f;
  font-size: 1.75rem;
  text-align: center;
}

.subtitle {
  margin: 0 0 2rem 0;
  color: #666;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  font-weight: 600;
  color: #1e3a5f;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #d1e3f5;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

input::placeholder {
  color: #aaa;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.success {
  color: #22c55e;
  background: #f0fdf4;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.error {
  color: #ef4444;
  background: #fef2f2;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #d1e3f5;
}

.divider span {
  padding: 0 1rem;
  color: #999;
  font-size: 0.9rem;
}

.login-link {
  text-align: center;
  color: #666;
  margin: 0;
}

.login-link a {
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>