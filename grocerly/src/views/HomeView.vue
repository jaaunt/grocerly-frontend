<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import {ref, onMounted} from "vue";
import apiClient from "@/sevices/api.js";
import { useCartStore } from '@/stores/cart'

import bitterImg from "@/assets/products/bitter_sokolaad.jpg";
import komboImg from "@/assets/products/sokolaadide_kombo.png";
import turkiImg from "@/assets/products/türgi_sokolaad.png";

const cartStore = useCartStore()

// Testimiseks - eemalda kui backend on valmis
const products = ref([
  {
    id: 1,
    productName: 'Bitter šokolaad',
    productDesciption: 'Kvaliteetne tume šokolaad',
    price: 4.99,
    productQuantity: 15
  },
  {
    id: 2,
    productName: 'Šokolaadide kombo',
    productDesciption: 'Segapakk erinevaid šokolaade',
    price: 12.99,
    productQuantity: 8
  },
  {
    id: 3,
    productName: 'Türgi šokolaad',
    productDesciption: 'Eksootiline maitse',
    price: 6.50,
    productQuantity: 20
  }
]);

// Funktsioon pildi valikuks
const getImageForProduct = (product) => {
  const imageMap = {
    'Bitter šokolaad': bitterImg,
    'Šokolaadide kombo': komboImg,
    'Türgi šokolaad': turkiImg
  };

  return imageMap[product.productName] || bitterImg;
};

const addToCart = (product) => {
  cartStore.addItem({
    id: product.id,
    name: product.productName,
    price: product.price,
    image: getImageForProduct(product),
    stock: product.productQuantity
  })
  cartStore.openCart()
}

// Kui backend on valmis, asenda ülaltoodud testimisandmed sellega:
/*
const products = ref([]);

onMounted(async () => {
  try {
    const response = await apiClient.get('/products');
    products.value = response.data;
  } catch (error) {
    console.error('Toodete laadimine ebaõnnestus:', error);
  }
});
*/

</script>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  padding: 24px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
}

.add-to-cart-btn {
  background-color: #3daed4;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.product-image-wrapper {
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 12px;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>

<template>
  <main class="page">
    <section class="products-grid">

      <article
          v-for="product in products"
          :key="product.id"
          class="product-card"
      >
        <div class="product-image-wrapper">
          <img
              :src="getImageForProduct(product)"
              :alt="product.productName"
              class="product-image"
          />
        </div>

        <h3 class="product-name">{{ product.productName }}</h3>

        <p class="product-description">
          {{ product.productDesciption }}
        </p>

        <div class="product-price-block">
          <div class="price-main">
            <span class="price-number">{{ product.price }}</span>
            <span class="price-currency">€</span>
          </div>

          <div class="price-stock">
            Laos: {{ product.productQuantity }} tk
          </div>
        </div>

        <button
            class="add-to-cart-btn"
            @click="addToCart(product)"
        >
          Lisa ostukorvi
        </button>
      </article>
    </section>
  </main>
</template>