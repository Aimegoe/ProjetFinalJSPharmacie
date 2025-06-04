<script setup>
import { ref } from 'vue';
import ListeMedicaments from './components/ListeMedicaments.vue'
const nomMedicament = ref('');
</script>
<template>
  <div class="app-container">
    <h1 class="app-titre">💊 Pharmacie du bon vivant 💊</h1>
    <h2 class="sous-titre"> Bienvenue sur le site de la pharmacie du bon vivant </h2>
    <br />
    <ListeMedicaments :recherche="nomMedicament" />
  </div>
</template>
<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

.app-titre {
  color: #a7c957;
  margin-bottom: 30px;
  font-size: 2.5em;
}

.sous-titre {
  color: #386641;
}
</style>
