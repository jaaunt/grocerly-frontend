<script setup>
import {ref, onMounted} from "vue";
import apiClient from "@/sevices/api.js";
const users = ref([])

const fetchUser = async() => {
  const response = await apiClient.get("/all-users");
  users.value = response.data;
}

onMounted(() => {
  fetchUser()
})
</script>

<template>
  <div>
    <h1>All Users</h1>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Firstname</th>
      </tr>
      </thead>
    </table>
    <tbody>
    <tr v-for="user in users" :key="user.id">
      <td>{{ user.userId}}</td>
      <td>{{ user.firstName}}</td>
    </tr>
    </tbody>

  </div>
</template>

<style scoped>

</style>