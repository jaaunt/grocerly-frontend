<script setup>
import { ref, onMounted, watch } from "vue"
import apiClient from "@/sevices/api.js"
import { useRoute } from "vue-router"
import MyOrders from "@/components/MyOrders.vue"

const route = useRoute()
const user = ref(null)
const error = ref("")
const showModal = ref(false)  // ← UUS: modali nähtavuse olek

// ← UUS: Vorm andmed
const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: ""
})
// UUS LÕPP ↑

const fetchUser = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}`)
    user.value = response.data
  } catch (err) {
    console.error(err)
    error.value = "Unable to load user profile."
  }
}

// ← UUS ALGAB: Ava modal ja täida vorm praeguste andmetega
const openEditModal = () => {
  formData.value = {
    firstName: user.value.firstName,
    lastName: user.value.lastName,
    email: user.value.email,
    phone: user.value.phone
  }
  showModal.value = true
}

// Sulge modal
const closeModal = () => {
  showModal.value = false
}

// Salvesta muudatused
const saveChanges = async () => {
  try {
    const response = await apiClient.put(`/users/${route.params.id}`, formData.value)
    user.value = response.data  // Uuenda kasutaja andmed
    showModal.value = false
    error.value = ""
  } catch (err) {
    console.error(err)
    error.value = "Andmete salvestamine ebaõnnestus."
  }
}
// UUS LÕPP ↑

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

    <div v-else-if="user">  <!-- ← PEAB OLEMA v-else-if! -->
      <div class="card">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>First Name:</strong> {{ user.firstName }}</p>
        <p><strong>Last Name:</strong> {{ user.lastName }}</p>
        <p><strong>Phone:</strong> {{ user.phone }}</p>
      </div>

      <button @click="openEditModal" class="edit-btn">Muuda andmeid</button>

      <MyOrders />
    </div>

  <div v-else>
    <!-- Loading sektsioon -->
    <p>Loading user profile...</p>
  </div>

  <!-- Modal -->
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Muuda kasutaja andmeid</h2>

      <form @submit.prevent="saveChanges">
        <!-- Eesnimi -->
        <div class="form-group">
          <label>Eesnimi:</label>
          <input
              v-model="formData.firstName"
              type="text"
              required
              class="form-input"
          />
        </div>

        <!-- Perenimi -->
        <div class="form-group">
          <label>Perenimi:</label>
          <input
              v-model="formData.lastName"
              type="text"
              required
              class="form-input"
          />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label>E-mail:</label>
          <input
              v-model="formData.email"
              type="email"
              required
              class="form-input"
          />
        </div>

        <!-- Telefon -->
        <div class="form-group">
          <label>Telefon:</label>
          <input
              v-model="formData.phone"
              type="text"
              required
              class="form-input"
          />
        </div>

        <!-- Nupud -->
        <div class="modal-buttons">
          <button type="submit" class="save-btn">Salvesta</button>
          <button type="button" @click="closeModal" class="cancel-btn">Tühista</button>
        </div>
      </form>
    </div>
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

/* ← UUS ALGAB: Muuda andmeid nupp */
.edit-btn {
  margin-top: 1rem;
  padding: 10px 20px;
  background-color: #3daed4;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.edit-btn:hover {
  background-color: #2d8eb4;
}

/* Modal overlay (tume taust) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal sisu */
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-top: 0;
  color: #1b3a2d;
}

/* Vormi grupp */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3daed4;
}

/* Modal nupud */
.modal-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.save-btn {
  flex: 1;
  padding: 12px;
  background-color: #3daed4;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.save-btn:hover {
  background-color: #2d8eb4;
}

.cancel-btn {
  flex: 1;
  padding: 12px;
  background-color: #999;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.cancel-btn:hover {
  background-color: #777;
}
/* UUS LÕPP ↑ */

</style>
