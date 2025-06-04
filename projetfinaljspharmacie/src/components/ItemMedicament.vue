<script setup>
import { defineEmits, ref } from 'vue';

const props = defineProps([
  'medicament',
  'index',
  'listeFormesPharmaceutiques'
]);
const emit = defineEmits([
  'getMedicaments',
  'quantitemoinsun',
  'quantiteplusun'
]);
const modeModification = ref(false);
const photo = ref(null);
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return; // Si l'utilisateur annule la sélection du fichier, on ne fait rien
  // FileReader est un objet JavaScript permettant de lire le contenu d'un fichier 
  // de manière asynchrone.
  const reader = new FileReader();
  reader.onload = () => { // definir le traitement asynchrone du contenu du fichier
    photo.value = reader.result // --> convertit le contenu du fichier en base64
  };
  reader.readAsDataURL(file); // lance la lecture du fichier et donc la conversion en base64
};

function enregistrerModification(medicament, photo) {
  const urlModification = "https://apipharmacie.pecatte.fr/api/6/medicaments";
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const fetchOptionsModification = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify({
      id: medicament.id,
      denomination: medicament.denomination,
      formepharmaceutique: medicament.formepharmaceutique,
      qte: medicament.qte,
      photo: photo
    })
  };
  fetch(urlModification, fetchOptionsModification)
    .then((response) => response.json())
    .then((dataJson) => {
      emit('getMedicaments');
      modeModification.value = false;
    })
    .catch((error) => console.log(error));
}
</script>

<template>
  <div class="div-medicament">
    <img :src="medicament.photo" class="image-medicament">
    <div v-if="!modeModification" class="medicament-infos">
      <p>{{ medicament.afficheMedicament() }}</p>
      <div v-if="medicament.qte <= 5" class="faible-qte">
        <p>Attention, faible quantité !!</p>
      </div>
      <div class="boutonsParMedic">
        <button @click="$emit('quantiteplusun', medicament)" class="bouton">+1</button>
        <button @click="$emit('quantitemoinsun', medicament)" class="bouton">-1</button>
        <button @click="modeModification = true" class="bouton">Modifier</button>
        <button @click="$emit('supprimermedicament', medicament)" class="bouton">Supprimer</button>
      </div>
    </div>
    <div v-else class="formulaire-medicament">
      <form @submit.prevent="enregistrerModification(medicament, photo)">
        <input type="text" v-model="medicament.denomination" size="30" class="input-formulaire">
        <select v-model="medicament.formepharmaceutique" class="input-formulaire">
          <option v-for="forme in props.listeFormesPharmaceutiques" :key="forme" :value="forme">
            {{ forme }}
          </option>
        </select>
        <input type="number" v-model="medicament.qte" min="1" class="input-formulaire">
        <input id="photo" @change="handleFileUpload" type="file" class="input-formulaire">
        <button type="submit" class="bouton">Enregistrer</button>
        <button type="button" @click="modeModification = false" class="bouton">Annuler</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.div-medicament {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-medicament {
  height: 100px;
  width: auto;
  border-radius: 4px;
}

.medicament-infos {
  margin-top: 10px;
}

.faible-qte {
  color: red;
  font-weight: bold;
  margin: 10px 0;
}

.boutonsParMedic {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.bouton {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.bouton:hover {
  background-color: #0056b3;
}

.formulaire-medicament {
  margin-top: 10px;
}

.input-formulaire {
  display: block;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}
</style>
