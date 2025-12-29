<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/sevices/api.js";
import { useCartStore } from '@/stores/cart'

import bitterImg from "../../public/photo/bitter_sokolaad.jpg";
import komboImg from "../../public/photo/sokolaadide_kombo.png";
import turkiImg from "../../public/photo/türgi_sokolaad.png";

const cartStore = useCartStore()

// const products = ref([]);

onMounted(async () => {
  try {
    const response = await apiClient.get('/all-products');
    products.value = response.data;
  } catch (error) {
    console.error('Toodete laadimine ebaõnnestus:', error);
  }
});


// Funktsioon pildi valikuks
const getImageForProduct = (product) => {
  if (product.picture) {
    return `/photo/${product.picture}`;
  }
  return '/photo/default.jpg';
};

const addToCart = (product) => {
  cartStore.addItem({
    id: product.id,
    name: product.productName,
    price: parseFloat(product.price) || 0,
    image: getImageForProduct(product),
    stock: parseInt(product.productQuantity) || 10
  })
}

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
  grid-template-columns: repeat(auto-fill, 280px); /* fixed width et see suurus ei */
  /* muutuks iga rida, auto fill pane nii palju kui saab reale ss alla */
  gap: 24px;
  padding: 24px;
  justify-content: start;
}

/* Ühe toote kaart, annab igale tootele kena kasti ümarate nurkadega!*/
.product-card {
  border: 1px solid #ddd; /*  Õhuke hall ääris (1 piksel lai, hall värv #ddd) */
  border-radius: 12px;  /*  Ümarnurksed (12 pikslit) - teeb kaardi ilusaks */
  padding: 16px;   /*  Tühimik kaardi sisu ja äärise vahel (16 pikslit) */
  display: flex;
  flex-direction: column;


  /* UUS OSA!!!Uued read hover efekti jaoks.  -> linkimise jaoks lisatud */
  color: inherit;  /* Säilitab originaal teksti värvi */
  display: block;  /* Muudab lingi plokk-elemendiks */
  transition: transform 0.2s;  /* Sujuv animatsioon hoveriks */
}

/* UUS OSA!!!  linkimise jaoks lisatud */
.product-card:hover {
  transform: translateY(-4px);  /* Tõstab kaardi 4px üles */
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);  /* Lisa varju */
}

/* Ostukorvi nupp. Teeb punase, ümarnenud nupu, mis näeb välja nagu klikitav element!*/
.add-to-cart-btn {
  background-color: #3daed4;
  color: white; /*  Valge tekst */
  padding: 12px; /*  Tühimik nupu sisu ümber (12 pikslit) - teeb nupu suuremaks */
  border: none;  /*  Ei taha vaikimisi äärist */
  border-radius: 8px; /*  Ümarnenud nurgad (8 pikslit) */
  cursor: pointer; /* Hiir muutub näpuks, kui nupu peal - näitab, et see on klikitav */
  margin-top: auto;
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

/* Nuppude konteiner, paigutab nupud vertikaalselt */
.card-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
}

/* UUS! Vaata detaile link */
.details-link {
  display: block;
  text-align: center;
  padding: 12px;
  background: transparent;
  color: #3daed4;
  border: 2px solid #3daed4;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.details-link:hover {
  background: #3daed4;
  color: white;
}
/* UUS LÕPP */

/* UUS! Responsive nuppudele */
.add-to-cart-btn,
.details-link {
  padding: 10px;
  font-size: 0.9rem;
}
/* UUS LÕPP */

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, 220px);
    gap: 16px;
    padding: 16px;
  }

  .product-image-wrapper {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }

  .product-card {
    padding: 12px;
  }

  .product-image-wrapper {
    height: 150px;
  }

  .add-to-cart-btn {
    padding: 10px;
    font-size: 0.9rem;
  }

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

<!--      &lt;!&ndash; üks kaart iga toote jaoks &ndash;&gt;-->
<!--      <article-->
<!--          v-for="product in products"  see osa oli ennem, kui ei teinud klikitavaks -->
<!--          :key="product.id"-->
<!--          class="product-card"-->
<!--      >-->
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

        <!-- Nupud -->
        <div class="card-actions">
          <!-- Lisa ostukorvi -->
          <button
              class="add-to-cart-btn"
              @click="addToCart(product)"
          >
            Lisa ostukorvi
          </button>

          <!-- Vaata detaile -->
          <router-link
              :to="{ name: 'productDetail', params: { id: product.id } }"
              class="details-link"
          >
            Vaata detaile
          </router-link>
        </div>
      </article>
    </section>
  </main>
</template>

