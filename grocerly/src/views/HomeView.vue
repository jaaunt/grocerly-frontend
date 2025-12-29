<script setup>
import { ref, computed, onMounted } from "vue";
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
const searchQuery = ref('');
const loading = ref(false);
const minPrice = ref(null);
const maxPrice = ref(null);

// computed - filtered products
const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) {
    return products.value;
  }

  const query = searchQuery.value.toLowerCase();
  return products.value.filter(product => {
    const name = product.productName?.toLowerCase() || '';
    const description = product.productDescription?.toLowerCase() || '';
    return name.includes(query) || description.includes(query);
  });
});

// fetch products from backend
const fetchProducts = async () => {
  loading.value = true;
  try {
    // Build query parameters
    const params = new URLSearchParams();

    if (searchQuery.value) {
      params.append('q', searchQuery.value);
    }
    if (minPrice.value !== null && minPrice.value !== '') {
      params.append('minPrice', minPrice.value);
    }
    if (maxPrice.value !== null && maxPrice.value !== '') {
      params.append('maxPrice', maxPrice.value);
    }

    const url = params.toString()
        ? `/products?${params.toString()}`
        : '/all-products';

    const response = await apiClient.get(url);
    products.value = response.data;
  } catch (error) {
    console.error('Viga toodete laadimisel:', error);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

// clear all filters
const clearFilters = () => {
  searchQuery.value = '';
  minPrice.value = null;
  maxPrice.value = null;
  fetchProducts();
};

// search handler
let searchTimeout = null;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchProducts(searchQuery.value);
  }, 300);
};

// load products on mount
onMounted(() => {
  fetchProducts();
});


</script>

<template>
  <main class="page">

    <!-- SEARCH + FILTER -->
    <div class="search-and-filters">
      <!-- Search input -->
      <div class="search-container">
        <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Otsi tooteid..."
            class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>

      <!-- price filter -->
      <div class="filters-group">
        <label>Hind:</label>
        <input
            v-model.number="minPrice"
            @input="handleSearch"
            type="number"
            placeholder="Min"
            class="price-input"
            min="0"
            step="0.5"
        />
        <span class="price-separator">-</span>
        <input
            v-model.number="maxPrice"
            @input="handleSearch"
            type="number"
            placeholder="Max"
            class="price-input"
            min="0"
            step="0.5"
        />
        <span class="price-currency">€</span>
      </div>

      <!-- clear button -->
      <button
          @click="clearFilters"
          class="clear-filters-btn"
      >
        Clear
      </button>
    </div>

    <!-- loading state -->
    <div v-if="loading" class="loading">
      Laeb...
    </div>

    <!-- PRODUCTS GRID -->
    <section v-else-if="filteredProducts.length > 0" class="products-grid">

      <article
          v-for="product in filteredProducts"
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

    <!-- no results message -->
    <div v-else class="no-results">
      <p>Tooteid ei leitud</p>
    </div>

  </main>
</template>

<style scoped>
/* SEARCH + FILTER */
.search-and-filters {
  max-width: 1000px;
  margin: 24px auto;
  padding: 0 24px;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  height: 48px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 50px;
  outline: none;
  transition: all 0.3s ease;
  background-color: #fff;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #3daed4;
  box-shadow: 0 0 0 3px rgba(61, 174, 212, 0.1);
}

.search-input::placeholder {
  color: #999;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  pointer-events: none;
  color: #999;
}

/* Price filters */
.filters-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f8f9fa;
  padding: 0.75rem 1rem;
  height: 48px;
  border-radius: 50px;
  white-space: nowrap;
  box-sizing: border-box;
}

.filters-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.price-input {
  width: 70px;
  padding: 0.4rem 0.5rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
  background-color: white;
}

.price-input:focus {
  border-color: #3daed4;
  outline: none;
}

.price-separator {
  color: #666;
  font-weight: 500;
}

.price-currency {
  color: #666;
  font-weight: 600;
  font-size: 0.9rem;
}

.clear-filters-btn {
  padding: 0 1.5rem;
  height: 48px;
  background-color: #3daed4;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-filters-btn:hover {
  background-color: #2d8bb3;
}

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


  /* Uued read hover efekti jaoks.  -> linkimise jaoks lisatud */
  color: inherit;  /* Säilitab originaal teksti värvi */
  display: block;  /* Muudab lingi plokk-elemendiks */
  transition: transform 0.2s;  /* Sujuv animatsioon hoveriks */
}

/*  linkimise jaoks lisatud */
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


/* Responsive nuppudele */
.add-to-cart-btn,
.details-link {
  padding: 10px;
  font-size: 0.9rem;
}


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