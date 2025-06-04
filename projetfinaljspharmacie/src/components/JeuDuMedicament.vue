<script setup>
import { ref, onMounted } from 'vue';

const medicaments = ref([]);
const medicamentAleatoire = ref(null);
const medicamentSelectionne = ref(null);
const message = ref('');
const propositionsFausses = ref([]);
let nombrePropositionsFausses = 0;
const jeuEnCours = ref(false);

function getImage(photo) {
  if (!photo) {
    return null;
  }
  return `https://apipharmacie.pecatte.fr/images/${photo}`;
}
function getMedicaments() {
  const url = `https://apipharmacie.pecatte.fr/api/6/medicaments`;
  fetch(url)
    .then((response) => response.json())
    .then((dataJson) => {
      medicaments.value = dataJson.map(med => ({
        id: med.id,
        nom: med.denomination,
        forme: med.formepharmaceutique,
        qte: med.qte,
        photo: getImage(med.photo)
      }));
    })
    .catch((error) => console.log(error));
}
function choisirMedicamentAleatoire() {
  if (medicaments.value.length === 0) return;
  const indexAleatoire = Math.floor(Math.random() * medicaments.value.length);
  medicamentAleatoire.value = medicaments.value[indexAleatoire];
  message.value = '';
  propositionsFausses.value = [];
  jeuEnCours.value = true;
}
function verifierSelection() {
  if (!medicamentSelectionne.value || !medicamentAleatoire.value) return;
  if (medicamentSelectionne.value.id === medicamentAleatoire.value.id) {
    message.value = `Félicitations, vous avez gagné au bout de ` + nombrePropositionsFausses + ` tentatives ! La bonne réponse était : ${medicamentAleatoire.value.nom}`;
    nombrePropositionsFausses = 0;
  } else {
    nombrePropositionsFausses += 1;
    message.value = "Mauvaise réponse, essayez encore. Nombre de mauvaises réponses: " + nombrePropositionsFausses.toString();
    if (!propositionsFausses.value.some(med => med.id === medicamentSelectionne.value.id)) {
      propositionsFausses.value.push(medicamentSelectionne.value);
    }
  }
}
function recommencer() {
  medicamentAleatoire.value = null;
  medicamentSelectionne.value = null;
  message.value = '';
  propositionsFausses.value = [];
  jeuEnCours.value = false;
}
onMounted(() => {
  getMedicaments();
});
</script>

<template>
  <div class="conteneur-jeu">
    <button v-if="!jeuEnCours" @click="choisirMedicamentAleatoire" class="bouton-demarrer">Jeu du médicament</button>
    <div v-if="medicamentAleatoire" class="jeu-medicament-aleatoire">
      <p class="devine-le-medicament">Un médicament a été tiré au sort, à vous de trouver duquel il s'agit:</p>
      <select v-model="medicamentSelectionne" class="selection-medicament">
        <option v-for="medicament in medicaments" :key="medicament.id" :value="medicament">
          {{ medicament.nom }}
        </option>
      </select>
      <button @click="verifierSelection" class="bouton-verif">Vérifier</button>
      <p class="message" :class="{ 'bonne-reponse': message.includes('Félicitations') }">{{ message }}</p>
      <div v-if="propositionsFausses.length > 0" class="mauvaise-reponses">
        <p class="mauvaise-reponses-texte">Mauvaises réponses :</p>
        <ul class="mauvaises-reponses-ul">
          <li v-for="medicament in propositionsFausses" :key="medicament.id" class="mauvaises-reponses-li">
            {{ medicament.nom }}
          </li>
        </ul>
      </div>
      <button @click="recommencer" class="bouton-redemarrer">Annuler</button>
    </div>
  </div>
</template>
<style scoped>
.conteneur-jeu {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

.bouton-demarrer {
  padding: 10px 20px;
  background-color: #8210c9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.bouton-demarrer:hover {
  background-color: #730db2;
}

.jeu-medicament-aleatoire {
  margin-top: 20px;
}

.devine-le-medicament {
  font-size: 18px;
  margin-bottom: 10px;
}

.selection-medicament {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 10px;
}

.bouton-verif {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.bouton-verif:hover {
  background-color: #5a6268;
}

.message {
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
}

.bonne-reponse {
  color: #28a745;
}

.mauvaise-reponses {
  margin-top: 20px;
  text-align: left;
}

.mauvaise-reponses-texte {
  font-weight: bold;
  margin-bottom: 10px;
}

.mauvaises-reponses-ul {
  list-style: none;
  padding: 0;
}

.mauvaises-reponses-li {
  padding: 5px 0;
  color: #dc3545;
}

.bouton-redemarrer {
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.bouton-redemarrer:hover {
  background-color: #c82333;
}
</style>
