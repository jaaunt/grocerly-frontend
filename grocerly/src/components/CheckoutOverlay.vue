<script setup>
import { ref, watch } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import apiClient from "@/sevices/api.js"

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])
const cartStore = useCartStore()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref("")

const orderDetails = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: ""
})

watch(() => props.show, async (newVal) => {
  if (newVal && authStore.isLoggedIn) {
    loading.value = true
    error.value = ""
    try {
      const response = await apiClient.get(`/users/${authStore.user.id}`)
      const userData = response.data

      orderDetails.value.firstName = userData.firstName || ""
      orderDetails.value.lastName = userData.lastName || ""
      orderDetails.value.email = userData.email || ""
      orderDetails.value.phone = userData.phone || ""
      orderDetails.value.address = ""
      orderDetails.value.city = ""
      orderDetails.value.postalCode = ""
    } catch (err) {
      console.error("Kasutaja andmete laadimine ebaõnnestus:", err)
      error.value = "Andmete laadimine ebaõnnestus"
    } finally {
      loading.value = false
    }
  }
})

const closeCheckout = () => {
  emit('close')
}

const submitOrder = async () => {
  try {
    const orderData = {
      userId: authStore.user.id,
      name: `${orderDetails.value.firstName} ${orderDetails.value.lastName}`,
      email: orderDetails.value.email,
      phone: orderDetails.value.phone,
      address: `${orderDetails.value.address}, ${orderDetails.value.city}, ${orderDetails.value.postalCode}`,
      orderItems: cartStore.items.map(item => `${item.name} x ${item.quantity}`).join(', '),
      totalPrice: cartStore.totalPrice
    }

    await apiClient.post('/orders', orderData)

    cartStore.clearCart()
    emit('close')
    alert('Tellimus esitatud!')
  } catch (err) {
    console.error(err)
    error.value = "Tellimuse esitamine ebaõnnestus"
  }
}

</script>
<template>
  <Teleport to="body">
    <div v-if="show" class="checkout-overlay">
      <div class="checkout-modal">
        <div class="checkout-header">
          <h2>Tellimuse vormistamine</h2>
          <button class="close-btn" @click="closeCheckout">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div v-if="loading" class="checkout-loading">
          Laadin...
        </div>

        <form v-else class="checkout-form" @submit.prevent="submitOrder">
          <h3>Kontaktandmed</h3>

          <div class="form-row">
            <div class="form-group">
              <label>Eesnimi</label>
              <input v-model="orderDetails.firstName" type="text" required />
            </div>
            <div class="form-group">
              <label>Perenimi</label>
              <input v-model="orderDetails.lastName" type="text" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>E-mail</label>
              <input v-model="orderDetails.email" type="email" required />
            </div>
            <div class="form-group">
              <label>Telefon</label>
              <input v-model="orderDetails.phone" type="text" required />
            </div>
          </div>

          <h3>Tarneaadress</h3>

          <div class="form-group">
            <label>Aadress</label>
            <input v-model="orderDetails.address" type="text" placeholder="Tänav, maja, korter" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Linn</label>
              <input v-model="orderDetails.city" type="text" required />
            </div>
            <div class="form-group">
              <label>Postiindeks</label>
              <input v-model="orderDetails.postalCode" type="text" required />
            </div>
          </div>

          <div class="order-summary">
            <h3>Tellimus</h3>
            <div v-for="item in cartStore.items" :key="item.id" class="summary-item">
              <span>{{ item.name }} x {{ item.quantity }}</span>
              <span>{{ (item.price * item.quantity).toFixed(2) }}€</span>
            </div>
            <div class="summary-total">
              <span>Kokku:</span>
              <span>{{ cartStore.totalPrice.toFixed(2) }}€</span>
            </div>
          </div>

          <p v-if="error" class="checkout-error">{{ error }}</p>

          <button type="submit" class="submit-btn">
            Esita tellimus
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.checkout-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkout-modal {
  background: #fff;
  border-radius: 16px;
  width: 550px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.5);
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #c5ddf5;
}

.checkout-header h2 {
  margin: 0;
  color: #1e3a5f;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0.25rem;
}

.close-btn:hover {
  color: #1e3a5f;
}

.checkout-loading {
  padding: 3rem;
  text-align: center;
  color: #666;
}

.checkout-form {
  padding: 1.5rem;
}

.checkout-form h3 {
  margin: 0 0 1rem 0;
  color: #1e3a5f;
  font-size: 1.1rem;
}

.checkout-form h3:not(:first-child) {
  margin-top: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #1e3a5f;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1e3f5;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.order-summary {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  margin: 1.5rem 0;
}

.order-summary h3 {
  margin: 0 0 0.75rem 0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  color: #1e3a5f;
  font-weight: 500;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding-top: 0.75rem;
  font-weight: 700;
  color: #1e3a5f;
  font-size: 1.1rem;
}

.checkout-error {
  color: #ef4444;
  background: #fef2f2;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #2563eb;
}

@media (max-width: 480px) {
  .checkout-modal {
    max-height: 100vh;
    max-width: 100%;
    border-radius: 0;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>
