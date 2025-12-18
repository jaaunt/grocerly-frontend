<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/services/api.js';

const route = useRoute();
const router = useRouter();
const product = ref(null);
const brand = ref(null);
const loading = ref(true);

const productImage = computed(() => {
  if (!product.value?.picture) return '/photo/bitter_sokolaad.jpg';
  return `/photo/${product.value.picture}`;
});

onMounted(async () => {
  try {
    const productId = route.params.id;

    const productResponse = await apiClient.get(`/products/${productId}`);
    product.value = productResponse.data;

    if (product.value.brandId) {
      const brandResponse = await apiClient.get(`/brands/${product.value.brandId}`);
      brand.value = brandResponse.data;
    }

    loading.value = false;
  } catch (error) {
    console.error('Viga toote laadimisel:', error);
    loading.value = false;
  }
});

const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="product-detail-page">
    <button @click="goBack" class="back-btn">← Tagasi</button>

    <div v-if="loading" class="loading">Laadimine...</div>

    <div v-else-if="product" class="product-detail">
      <div class="product-image-section">
        <img
            :src="productImage"
            :alt="product.productName"
            class="detail-image"
        />
      </div>

      <div class="product-info-section">
        <h1 class="product-title">{{ product.productName }}</h1>

        <div v-if="brand" class="brand-info">
          <span class="brand-label">Brand:</span>
          <span class="brand-name">{{ brand.brandName }}</span>
        </div>

        <p class="product-description-full">
          {{ product.productDescription }}
        </p>

        <div class="price-section">
          <span class="price-amount">{{ product.price }}€</span>
        </div>

        <div class="stock-info">
          <span class="stock-label">Laoseis:</span>
          <span class="stock-amount">{{ product.productQuantity }} tk</span>
        </div>

        <button class="add-to-cart-btn-detail">Lisa ostukorvi</button>
      </div>
    </div>

    <div v-else class="error">Toodet ei leitud</div>
  </div>
</template>

<style scoped>
.product-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.back-btn {
  background-color: #f0f0f0;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 24px;
  font-size: 16px;
}

.back-btn:hover {
  background-color: #e0e0e0;
}

.loading, .error {
  text-align: center;
  padding: 48px;
  font-size: 18px;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

.product-image-section {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 48px;
}

.detail-image {
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
}

.product-info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-title {
  font-size: 32px;
  font-weight: bold;
  margin: 0;
}

.brand-info {
  display: flex;
  gap: 8px;
  font-size: 16px;
}

.brand-label {
  font-weight: bold;
  color: #666;
}

.brand-name {
  color: #3daed4;
  font-weight: 500;
}

.product-description-full {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.price-section {
  margin-top: 12px;
}

.price-amount {
  font-size: 36px;
  font-weight: bold;
  color: #2c3e50;
}

.stock-info {
  display: flex;
  gap: 8px;
  font-size: 16px;
}

.stock-label {
  font-weight: bold;
  color: #666;
}

.stock-amount {
  color: #27ae60;
  font-weight: 500;
}

.add-to-cart-btn-detail {
  background-color: #3daed4;
  color: white;
  padding: 16px 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  margin-top: 12px;
}

.add-to-cart-btn-detail:hover {
  background-color: #2d8eb4;
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .product-title {
    font-size: 24px;
  }

  .price-amount {
    font-size: 28px;
  }
}
</style>
