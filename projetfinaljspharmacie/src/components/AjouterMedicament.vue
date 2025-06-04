<script setup>
import { ref } from 'vue';

const props = defineProps({
  listeMedicaments: Array,
  listeFormesPharmaceutiques: Array
});
const emit = defineEmits([
  'ajoutReussi'
]);
const nom = ref('');
const forme = ref('');
const qte = ref(0);
const messageErreur = ref('');
const photo = ref(null); // --> variable qui va contenir le fichier en base64
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

function enregistrerMedicament() {
  messageErreur.value = '';
  const nomExistant = props.listeMedicaments.some(med => med.getDenomination().toLowerCase() === nom.value.toLowerCase());
  let erreur = false;

  if (nomExistant) {
    messageErreur.value = "Ce médicament existe déjà.";
    erreur = true;
  }
  if (!nom.value.trim()) {
    messageErreur.value = "Le nom du médicament est requis.";
    erreur = true;
  }
  if (!forme.value.trim()) {
    messageErreur.value = "Veuillez sélectionner une forme pharmaceutique.";
    erreur = true;
  }
  if (erreur) return;

  const urlAjout = `https://apipharmacie.pecatte.fr/api/6/medicaments`;
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const fetchOptionsAjout = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      denomination: nom.value,
      formepharmaceutique: forme.value,
      qte: qte.value,
      photo: photo.value
    })
  };
  fetch(urlAjout, fetchOptionsAjout)
    .then(res => res.json())
    .then(data => {
      emit('ajoutReussi'); // ça envoie au parent que c'est bon
    })
    .catch(error => {
      messageErreur.value = "Erreur lors de l'ajout du médicament.";
      console.error(error);
    });
  nom.value = '';
  qte.value = '';
  forme.value = '';
}
</script>

<template>
  <div class="formulaire">
    <p v-if="messageErreur" class="erreur">{{ messageErreur }}</p>
    <form @submit.prevent="enregistrerMedicament" class="formulaire-medoc">
      <input type="text" v-model="nom" placeholder="Nom du médicament" class="formulaire-input" />
      <select v-model="forme" class="formulaire-input">
        <option disabled value="">Sélectionnez une forme</option>
        <option v-for="(formeItem, index) in listeFormesPharmaceutiques" :key="index" :value="formeItem">
          {{ formeItem }}
        </option>
      </select>
      <input type="number" v-model="qte" min="0" class="formulaire-input" />
      <input id="photo" @change="handleFileUpload" type="file" />
      <input type="submit" value="Enregistrer" class="bouton-envoi" />
    </form>
  </div>
</template>

<style scoped>
.formulaire {
  margin-top: 20px;
}

.formulaire-medoc {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.formulaire-input {
  padding: 10px;
  border-radius: 4px;
  font-size: 16px;
  border: 1px solid #ccc;
}

.bouton-envoi {
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.erreur {
  color: #c82333;
}
</style>
