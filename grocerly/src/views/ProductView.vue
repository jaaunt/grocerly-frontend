<script setup>
import {ref, onMounted} from "vue";
import apiClient from "@/sevices/api.js";
const products = ref([])
const fetchProducts = async() => {
  const response = await apiClient.get("/all-products");
  products.value = response.data;
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div>
    <h1>Product</h1>
    <table>
      <thead>
      <tr>
        <th>id</th>
        <th>productName</th>
        <th>productDescription</th>
        <th>price</th>
        <th>productQuantity</th>

      </tr>
      </thead>
    </table>
    <tbody>
    <tr v-for="product in products" :key="product.id">
      <td>{{ product.id}}</td>
      <td>{{ product.productName}}</td>
      <td>{{ product.productDesciption}}</td>
      <td>{{ product.price}}</td>
      <td>{{ product.productQuantity}}</td>
    </tr>
    </tbody>

  </div>
</template>

<style scoped>

</style>