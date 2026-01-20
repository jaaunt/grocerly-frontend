<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import CheckoutOverlay from './CheckoutOverlay.vue'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const showCheckout = ref(false)

const handleLogin = () => {
  router.push('/login')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const goToProfile = () => {
  router.push(`/users/${authStore.user.id}`)
}

const handleCheckout = () => {
  if (!authStore.isLoggedIn) {
    cartStore.closeCart()
    router.push('/login')
    return
  }

  cartStore.closeCart()
  showCheckout.value = true
}

const closeCheckout = () => {
  showCheckout.value = false
}
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <span class="logo-text">Grocerly</span>
      </div>

      <nav class="nav-links">
        <router-link to="/">Avaleht</router-link>
      </nav>

      <div class="header-actions">
        <button class="cart-btn" @click="cartStore.toggleCart">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span v-if="cartStore.totalItems > 0" class="cart-badge">{{ cartStore.totalItems }}</span>
        </button>

        <button v-if="authStore.isLoggedIn" class="profile-btn" @click="goToProfile">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>

        <button v-if="!authStore.isLoggedIn" class="login-btn" @click="handleLogin">
          Logi sisse
        </button>
        <button v-else class="login-btn" @click="handleLogout">
          Logi välja
        </button>
      </div>
    </div>
  </header>

  <!-- Cart Overlay -->
  <div v-if="cartStore.isOpen" class="cart-overlay" @click="cartStore.closeCart"></div>

  <!-- Cart Sidebar -->
  <aside class="cart-sidebar" :class="{ open: cartStore.isOpen }">
    <div class="cart-header">
      <h2>Ostukorv</h2>
      <button class="close-btn" @click="cartStore.closeCart">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div class="cart-content">
      <div v-if="cartStore.items.length === 0" class="cart-empty">
        <p>Ostukorv on tühi</p>
      </div>

      <div v-else class="cart-items">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <img :src="item.image" :alt="item.name" class="item-image" />
          <div class="item-info">
            <h3 class="item-name">{{ item.name }}</h3>
            <p class="item-price">{{ item.price.toFixed(2) }}€</p>
          </div>
          <div class="item-actions">
            <div class="quantity-controls">
              <button @click="cartStore.decreaseQuantity(item.id)">−</button>
              <span>{{ item.quantity }}</span>
              <button @click="cartStore.increaseQuantity(item.id)">+</button>
            </div>
            <button class="remove-btn" @click="cartStore.removeItem(item.id)">Eemalda</button>
          </div>
        </div>
      </div>
    </div>

    <div class="cart-footer">
      <div class="cart-total">
        <span>Kokku:</span>
        <span class="total-price">{{ cartStore.totalPrice.toFixed(2) }}€</span>
      </div>
      <button class="checkout-btn" @click="handleCheckout">
        Maksma
      </button>
    </div>
  </aside>

  <!-- Checkout Overlay -->
  <CheckoutOverlay :show="showCheckout" @close="closeCheckout" />
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #1e3a5f;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.header-content {
  width: 100%;
  margin: 0 auto;
  padding: 1.25rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-text {
  font-size: 2rem;
  font-weight: bold;
  color: #5db8f5;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 3.5rem;
}

.nav-links a {
  color: #d1e3f5;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #5db8f5;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cart-btn {
  position: relative;
  background: none;
  border: none;
  color: #d1e3f5;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.cart-btn svg {
  width: 28px;
  height: 28px;
}

.cart-btn:hover {
  color: #5db8f5;
}

.cart-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.15rem 0.4rem;
  border-radius: 50%;
  min-width: 18px;
  text-align: center;
}

.profile-btn {
  background: none;
  border: none;
  color: #d1e3f5;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.profile-btn svg {
  width: 28px;
  height: 28px;
}

.profile-btn:hover {
  color: #5db8f5;
}

.login-btn {
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background-color: #5db8f5;
}

/* Cart Overlay */
.cart-overlay {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 998;
}

/* Cart Sidebar */
.cart-sidebar {
  position: fixed;
  top: 80px;
  right: 0;
  bottom: 0;
  width: 480px;
  max-width: 100%;
  background: linear-gradient(to right, #b8d4ed 0%, #ffffff 12%, #ffffff 100%);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 999;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.cart-sidebar.open {
  transform: translateX(0);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: none;
  position: relative;
}

.cart-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #c5ddf5;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1e3a5f;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0.25rem;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #1e3a5f;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.item-info {
  flex: 1;
}

.item-name {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  color: #1e3a5f;
}

.item-price {
  margin: 0;
  font-weight: 600;
  color: #333;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-controls button {
  width: 24px;
  height: 24px;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.quantity-controls button:hover {
  background: #f0f0f0;
}

.quantity-controls span {
  min-width: 20px;
  text-align: center;
  font-weight: 600;
  color: #1e3a5f;
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.8rem;
  cursor: pointer;
}

.remove-btn:hover {
  text-decoration: underline;
}

.cart-footer {
  padding: 1.25rem 1.5rem;
  border-top: none;
  background: linear-gradient(to right, #b8d4ed 0%, #ffffff 12%, #ffffff 100%);
  position: relative;
}

.cart-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #c5ddf5;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #333;
}

.total-price {
  font-weight: 700;
  color: #1e3a5f;
}

.checkout-btn {
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
}

.checkout-btn:hover {
  background-color: #5db8f5;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .header-content {
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .cart-sidebar {
    width: 100%;
  }
}
</style>