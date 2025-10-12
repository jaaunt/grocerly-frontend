<script setup>
import { ref } from "vue"
import apiClient from "@/sevices/api.js"
import { useRouter } from "vue-router"

const router = useRouter()

const user = ref({
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  phone: ""
})

const message = ref("")
const error = ref("")

const registerUser = async () => {
  try {
    const response = await apiClient.post("/register", user.value)
    message.value = "User registered successfully!"
    error.value = ""
    router.push("/users")
  } catch (err) {
    console.error(err)
    if (err.response && err.response.status === 400) {
      // backi sonum
      error.value = err.response.data
    } else {
      error.value = "Error registering user."
    }
  }
}
</script>

<template>
  <div class="register">
    <h1>Register New User</h1>

    <form @submit.prevent="registerUser">
      <label>First Name</label>
      <input v-model="user.firstName" type="text" required />

      <label>Last Name</label>
      <input v-model="user.lastName" type="text" required />

      <label>Username</label>
      <input v-model="user.username" type="text" required />

      <label>Email</label>
      <input v-model="user.email" type="email" required />

      <label>Password</label>
      <input v-model="user.password" type="password" required />

      <label>Phone</label>
      <input v-model="user.phone" type="text" required />

      <button type="submit">Register</button>
    </form>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.register {
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

.success {
  color: green;
}

.error {
  color: red;
}
</style>
