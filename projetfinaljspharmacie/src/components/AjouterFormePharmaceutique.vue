<script setup>
import { ref } from 'vue';

const listeLocale = defineProps({
  listeFormesPharmaceutiques: Array
});
const emit = defineEmits([
  'formeAjoutee'
]);
const nouvelleForme = ref('');
const erreur = ref('');
const success = ref('');

function ajouterForme() {
  const forme = nouvelleForme.value.trim();
  erreur.value = '';
  success.value = '';
  if (!forme) {
    erreur.value = "Veuillez saisir une forme pharmaceutique.";
    return;
  }
  if (listeLocale.listeFormesPharmaceutiques.includes(forme)) {
    erreur.value = "Cette forme pharmaceutique existe déjà.";
    return;
  }
  listeLocale.listeFormesPharmaceutiques.push(forme);
  emit('formeAjoutee', forme);

  success.value = "Forme pharmaceutique ajoutée avec succès !";
  nouvelleForme.value = '';
}
</script>

<template>
  <div class="ajout-forme">
    <input v-model="nouvelleForme" type="text" placeholder="Nouvelle forme pharmaceutique" class="formulaire-input" />
    <button @click="ajouterForme" class="bouton-envoi">Ajouter la forme</button>
    <p v-if="erreur" class="erreur">{{ erreur }}</p>
  </div>
</template>

<style scoped>
.ajout-forme {
  margin-top: 10px;
}

.bouton-envoi {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.formulaire-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.succes {
  color: #28a745;
}
</style>
