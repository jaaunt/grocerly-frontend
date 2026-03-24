<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '@/sevices/api.js'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const orders = ref([])
const loading = ref(false)
const error = ref('')
const selectedOrder = ref(null)
const showDetailModal = ref(false)

// Laadi tellimused
const fetchOrders = async () => {
  if (!authStore.user?.id) {
    error.value = 'Kasutaja ei ole sisse logitud'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await apiClient.get(`/orders/user/${authStore.user.id}`)
    orders.value = response.data
  } catch (err) {
    console.error('Tellimuste laadimine ebaõnnestus:', err)
    error.value = 'Tellimuste laadimine ebaõnnestus'
  } finally {
    loading.value = false
  }
}

// Ava detailne vaade
const openOrderDetails = (order) => {
  selectedOrder.value = order
  // hüpikaken avaneb
  showDetailModal.value = true
}

const closeModal = () => {
  // Sulge hüpikaken
  showDetailModal.value = false
  // Tühjenda valitud tellimus
  selectedOrder.value = null
}

  
// Parse order items (kui on JSON formaat).
const parseOrderItems = (orderItemsString) => {
  try {
    return JSON.parse(orderItemsString)
  } catch {
    // Kui ei ole JSON, tagasta text stringina
    return [{ productName: orderItemsString, quantity: 1 }]
  }
}

onMounted(() => {
  fetchOrders()
})

</script>

<template>
  <div class="my-orders">
    <h2>Minu Tellimused</h2>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <p>Laadin tellimusi...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <!-- Ei ole tellimusi -->
    <div v-else-if="orders.length === 0" class="no-orders">
      <p>Sul ei ole veel ühtegi tellimust.</p>
    </div>

    <!-- Tellimuste grid -->
    <div v-else class="orders-grid">
      <div
          v-for="order in orders"
          :key="order.id"
          class="order-card"
      >
        <div class="order-header">
          <h3>Tellimus #{{ order.id }}</h3>
          <!-- .toFixed(2) tagab 2 kohta komakohta (3.00€) -->
          <span class="order-price">{{ order.totalPrice.toFixed(2) }}€</span>
        </div>

        <div class="order-info">
          <p><strong>Nimi:</strong> {{ order.name }}</p>
          <p><strong>Email:</strong> {{ order.email }}</p>
          <p><strong>Telefon:</strong> {{ order.phone }}</p>
          <p><strong>Aadress:</strong> {{ order.address }}</p>
        </div>

        <div class="order-footer">
          <!-- Klikkides avab detailse hüpikakna -->
          <span class="view-details" @click="openOrderDetails(order)">Vaata detaile →</span>
        </div>
      </div>
    </div>

    <!-- Detailne hüpikaken -->
    <div v-if="showDetailModal && selectedOrder" class="modal-overlay">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Tellimus #{{ selectedOrder.id }}</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <div class="modal-body">
          <!-- Kontaktandmed -->
          <div class="detail-section">
            <h3>Kontaktandmed</h3>
            <p><strong>Nimi:</strong> {{ selectedOrder.name }}</p>
            <p><strong>Email:</strong> {{ selectedOrder.email }}</p>
            <p><strong>Telefon:</strong> {{ selectedOrder.phone }}</p>
          </div>

          <!-- Tarneaadress -->
          <div class="detail-section">
            <h3>Tarneaadress</h3>
            <p>{{ selectedOrder.address }}</p>
          </div>

          <!-- Tellitud tooted -->
          <div class="detail-section">
            <h3>Tellitud tooted</h3>
            <div class="order-items">
              <div
                  v-for="(item, index) in parseOrderItems(selectedOrder.orderItems)"
                  :key="index"
                  class="order-item"
              >
                <span class="item-name">{{ item.productName || item }}</span>
                <span v-if="item.quantity" class="item-quantity">x{{ item.quantity }}</span>
                <span v-if="item.price" class="item-price">{{ item.price.toFixed(2) }}€</span>
              </div>
            </div>
          </div>

          <!-- Kokku -->
          <div class="detail-section total-section">
            <h3>Kokku</h3>
            <p class="total-price">{{ selectedOrder.totalPrice.toFixed(2) }}€</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-orders {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #1b3a2d;
  border-radius: 12px;
}

.my-orders h2 {
  color: #fff;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Loading & Error */
.loading, .error, .no-orders {
  text-align: center;
  padding: 2rem;
  color: #fff;
}

.error {
  color: #ff6b6b;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.order-card {
  background: #0f241a;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(61, 174, 212, 0.3);
  border-color: #3daed4;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(61, 174, 212, 0.3);
}

.order-header h3 {
  color: #3daed4;
  margin: 0;
  font-size: 1.2rem;
}

.order-price {
  color: #fff;
  font-size: 1.3rem;
  font-weight: bold;
}

.order-info {
  color: #b8d4c8;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.order-info p {
  margin: 0.5rem 0;
}

.order-footer {
  text-align: right;
}

.view-details {
  color: #3daed4;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Hüpikaken */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.modal-header h2 {
  color: #1b3a2d;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #000;
}

.modal-body {
  padding: 1.5rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h3 {
  color: #1b3a2d;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.detail-section p {
  color: #333;
  margin: 0.5rem 0;
}

.order-items {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-name {
  flex: 1;
  color: #333;
  font-weight: 500;
}

.item-quantity {
  color: #666;
  margin: 0 1rem;
}

.item-price {
  color: #1b3a2d;
  font-weight: 600;
}

.total-section {
  background: #f0f8f5;
  padding: 1rem;
  border-radius: 8px;
}

.total-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1b3a2d;
  text-align: right;
}

/* Responsive */
@media (max-width: 768px) {
  .orders-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    max-width: 100%;
    border-radius: 0;
    max-height: 100vh;
  }
}
</style>
