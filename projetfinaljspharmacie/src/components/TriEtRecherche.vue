<script setup>
import { defineEmits, ref } from 'vue'
const emit = defineEmits([
  'trierDenomination',
  'trierQuantite',
  'trierParForme',
  'annulerTri',
])
const barreDeRecherche = ref('')
</script>
<template>
  <div class="recherche">
    <input v-model="barreDeRecherche" @input="$emit('BarreDeRecherche', barreDeRecherche)" size="30"
      placeholder="Rechercher un médicament" class="barre-de-recherche" />
  </div>
  <div class="boutons-de-tri">
    <button @click="$emit('trierDenomination')" class="bouton-de-tri">Trier par Dénomination</button>
    <button @click="$emit('trierQuantite')" class="bouton-de-tri">Trier par Quantité</button>
    <button @click="$emit('trierForme')" class="bouton-de-tri">Trier par Forme</button>
    <button @click="$emit('annulerTri')" class="annuler-tri">Annuler le Tri</button>
  </div>
</template>
<style scoped>
.boutons-de-tri {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.bouton-de-tri {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.bouton-de-tri:hover {
  background-color: #5a6268;
}

.annuler-tri {
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.annuler-tri:hover {
  background-color: #c82333;
}

.recherche {
  margin-bottom: 20px;
}

.barre-de-recherche {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}
</style>
