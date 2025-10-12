<script setup>
import { ref, onMounted, watch } from "vue"
import apiClient from "@/sevices/api.js"
import { useRoute } from "vue-router"

const route = useRoute()
const user = ref(null)
const error = ref("")

const fetchUser = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}`)
    user.value = response.data
  } catch (err) {
    console.error(err)
    error.value = "Unable to load user profile."
  }
}

// Watch route params in case user navigates to different profile
watch(() => route.params.id, (newId) => {
  if (newId) fetchUser(newId)
})

// Fetch current route param on mount
onMounted(() => {
  if (route.params.id) fetchUser(route.params.id)
})
</script>

<template>
  <div class="profile">
    <h1>User Profile</h1>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="user" class="card">
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>First Name:</strong> {{ user.firstName }}</p>
      <p><strong>Last Name:</strong> {{ user.lastName }}</p>
      <p><strong>Phone:</strong> {{ user.phone }}</p>
    </div>

    <div v-else-if="!error">
      <p>Loading user profile...</p>
    </div>
  </div>
</template>

<style scoped>
.profile {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #1b3a2d;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card {
  padding: 1rem;
  background: #0f241a;
  border-radius: 8px;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
