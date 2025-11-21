<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import {ref, onMounted} from "vue";
import apiClient from "@/sevices/api.js";

import bitterImg from "@/assets/products/bitter_sokolaad.jpg";
import komboImg from "@/assets/products/sokolaadide_kombo.png";
import turkiImg from "@/assets/products/türgi_sokolaad.png";

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

<template>
  <main class="page">
    <section class="products-grid">

      <!-- üks kaart iga toote jaoks -->
      <article
          v-for="product in products"
          :key="product.id"
          class="product-card"
      >
        <!-- pilt -->
        <div class="product-image-wrapper">
          <img
              :src="getImageForProduct(product)"
              :alt="product.productName"
              class="product-image"
          />
        </div>

        <!-- nimi -->
        <h3 class="product-name">{{ product.productName }}</h3>

        <!-- kirjeldus -->
        <p class="product-description">
          {{ product.productDesciption }}
        </p>

        <!-- hind ja kogus -->
        <div class="product-price-block">
          <div class="price-main">
            <span class="price-number">{{ product.price }}</span>
            <span class="price-currency">€</span>
          </div>

          <div class="price-stock">
            Laos: {{ product.productQuantity }} tk
          </div>
        </div>
      </article>

    </section>
  </main>
</template>
