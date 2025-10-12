<script setup>
import { ref } from "vue";
import apiClient from "@/sevices/api.js";
import { useRouter } from "vue-router";

const router = useRouter();
const login = ref({ username: "", password: "" });
const error = ref("");

const loginUser = async () => {
  try {
    const response = await apiClient.post("/login", login.value);
    const userId = response.data.id;
    router.push(`/users/${userId}`);
  } catch (err) {
    console.error(err);
    error.value = err.response?.data || "Login failed";
  }
};
</script>

<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="loginUser">
      <label>Username</label>
      <input v-model="login.username" type="text" required />

      <label>Password</label>
      <input v-model="login.password" type="password" required />

      <button type="submit">Login</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.login {
  max-width: 400px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-top: 0.5rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  margin-top: 1rem;
  padding: 0.7rem;
  border: none;
  background-color: #42b983;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #2e9e6d;
}

.error {
  color: red;
}
</style>
