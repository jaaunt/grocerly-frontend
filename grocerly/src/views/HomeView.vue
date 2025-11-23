<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import {ref, onMounted} from "vue";
import apiClient from "@/sevices/api.js";

import bitterImg from "@/assets/products/bitter_sokolaad.jpg";
import komboImg from "@/assets/products/sokolaadide_kombo.png";
import turkiImg from "@/assets/products/türgi_sokolaad.png";


// Funktsioon pildi valikuks
const getImageForProduct = (product) => {
  const imageMap = {
    'Bitter šokolaad': bitterImg,
    'Vanini šokolaadide valik, 5tk': komboImg,
    'Kunafa pistaatsiakreemiga šokolaad': turkiImg
  };

  return imageMap[product.productName] || bitterImg;
};


const products = ref([]);

onMounted(async () => {
   try {
     const response = await apiClient.get('/all-products');
     products.value = response.data;
   } catch (error) {
     console.error('Toodete laadimine ebaõnnestus:', error);
   }
 });


</script>

<style scoped>
/* scoped  tähendab, et need stiilid kehtivad ainult selles komponendis! */
/* CSS */
/* Loob ruudustiku, mis kohaneb ekraani suurusega automaatselt!*/
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* Loob automaatselt nii palju veerge kui mahub ekraanile.
   - repeat(auto-fit, ...)  mahuta automaatselt nii palju kaarte kui võimalik
   - minmax(220px, 1fr)  iga kaart on vähemalt 220px lai, aga võib kasvada võrdselt
   - Tulemus: suurel ekraanil 3-4 kaarti kõrvuti, väikesel 1-2 kaarti
   - Kui ekraan alla 660px (3×220px), lähevad kaardid automaatselt alla */
  gap: 24px;
  padding: 24px;
}

/* Ühe toote kaart, annab igale tootele kena kasti ümarate nurkadega!*/
.product-card {
  border: 1px solid #ddd; /*  Õhuke hall ääris (1 piksel lai, hall värv #ddd) */
  border-radius: 12px;  /*  Ümarnurksed (12 pikslit) - teeb kaardi ilusaks */
  padding: 16px;   /*  Tühimik kaardi sisu ja äärise vahel (16 pikslit) */
}

/* Ostukorvi nupp. Teeb punase, ümarnenud nupu, mis näeb välja nagu klikitav element!*/
.add-to-cart-btn {
  background-color: #3daed4;
  color: white; /*  Valge tekst */
  padding: 12px; /*  Tühimik nupu sisu ümber (12 pikslit) - teeb nupu suuremaks */
  border: none;  /*  Ei taha vaikimisi äärist */
  border-radius: 8px; /*  Ümarnenud nurgad (8 pikslit) */
  cursor: pointer; /* Hiir muutub näpuks, kui nupu peal - näitab, et see on klikitav */
}

/* Pildi konteiner, mis määrab maksimaalsed mõõtmed */
.product-image-wrapper {
  width: 100%;   /* Kontainer on 100% laiusega (täidab kogu kaardi laiuse) */
  height: 250px; /*  Kontainer on  250 pikslit kõrge

  /* Kolme alljärgneva rea tulemuseks on pilt täpselt keskel nii üleval, all, vasakul ja paremal on võrdselt tühja ruumi  */
  display: flex;
  align-items: center; /*  vertikaalselt (üles-alla) */
  justify-content: center; /* horisontaalselt (vasakult-paremale) */

  overflow: hidden; /* Kui pilt on suurem kui 250px, lõikab liigse osa ära (ei lähe üle konteineri) */
  margin-bottom: 12px;   /*  Lisab 12px tühimiku pildi alla (toote nime ette) */

}

/* Pilt ise mahuks kontaineri sisse */
.product-image {
  max-width: 100%;   /*  Pilt ei saa olla laiem kui kontainer (max 100% kontaineri laiusest) */
  max-height: 100%;   /*  Pilt ei saa olla kõrgem kui kontainer (max 250px) */

  object-fit: contain; /* Pilti ei venitata, et mahuks tervikuna kontaineri sisse, säilitades originaal proportsioonid  */
}

</style>

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

        <!-- ostukorvi nupp -->
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
