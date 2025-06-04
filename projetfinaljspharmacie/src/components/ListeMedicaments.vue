<script setup>
import ItemMedicament from './ItemMedicament.vue';
import Medicament from '../Medicaments.js';
import { reactive, computed, ref } from 'vue';
import JeuDuMedicament from './JeuDuMedicament.vue';
import TriEtRecherche from './TriEtRecherche.vue';
import AjouterMedicament from './AjouterMedicament.vue';
import AjouterFormePharmaceutique from './AjouterFormePharmaceutique.vue';


const listeMedicaments = reactive([]);
const listeFormesPharmaceutiques = reactive([]);
const triActif = ref({ type: null, denomination: false, quantite: false, forme: false, direction: 'asc' });
const barreDeRecherche = ref('');
// `computed` crée une propriété réactive qui filtre les médicaments en fonction de la recherche.
const medicamentsFiltres = computed(() => {
  if (!barreDeRecherche.value) {
    return listeMedicaments;
  }
  const rechercheMinuscule = barreDeRecherche.value.toLowerCase();
  // On filtre la liste en fonction de la recherche
  return listeMedicaments.filter(med =>
    med.getDenomination().toLowerCase().includes(rechercheMinuscule)
  );
});
let ajout = ref(false);

const ajoutForme = ref(false);
const succesAjoutForme = ref('');

function getMedicaments() {
  const url = "https://apipharmacie.pecatte.fr/api/6/medicaments";
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  let fetchOptions = { method: 'GET', headers: myHeaders, };
  fetch(url, fetchOptions)
    .then((response) => response.json())
    .then((dataJson) => {
      listeMedicaments.length = 0;
      dataJson.forEach(medicament => {
        let medic = new Medicament(medicament.id, medicament.denomination, medicament.formepharmaceutique, getImage(medicament.photo), medicament.qte)
        listeMedicaments.push(medic)
      })
      appliquerTri();
    })
    .catch((error) => console.log(error));
};
getMedicaments();
function getImage(photo) {
  if (photo) {
    return `https://apipharmacie.pecatte.fr/images/${photo}`
  }
}
function getFormes() {
  const url = "https://apipharmacie.pecatte.fr/api/6/medicaments";
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  let fetchOptions = { method: 'GET', headers: myHeaders, };
  fetch(url, fetchOptions)
    .then((response) => response.json())
    .then((dataJson) => {
      listeFormesPharmaceutiques.length = 0;
      dataJson.forEach(medicament => {
        let forme = medicament.formepharmaceutique
        listeFormesPharmaceutiques.push(forme)
      })
      appliquerTri();
    })
    .catch((error) => console.log(error));
};
getFormes();
function supprimerMedicament(medicament) {
  const urlDelete = `https://apipharmacie.pecatte.fr/api/6/medicaments/${medicament.id}`;
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json')
  const fetchOptionsDelete = { method: 'DELETE', headers: myHeaders, };
  fetch(urlDelete, fetchOptionsDelete)
    .then((response) => response.json())
    .then((dataJson) => {
      listeMedicaments.splice(medicament, 1)
      getMedicaments();
    })
    .catch((error) => console.log(error));
}
function QuantitePlusUn(medicament) {
  const urlQtePlus1 = `https://apipharmacie.pecatte.fr/api/6/medicaments`;
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json')
  const fetchOptionsQtePlus1 = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify({
      id: medicament.id,
      qte: medicament.qte + 1
    })
  };
  fetch(urlQtePlus1, fetchOptionsQtePlus1)
    .then(response => response.json())
    .then(dataJson => {
      getMedicaments();
    })
    .catch(error => {
      console.error("Erreur mise à jour quantité :", error);
    });
}
function QuantiteMoinsUn(medicament) {
  const urlQteMoins1 = `https://apipharmacie.pecatte.fr/api/6/medicaments`;
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json')
  const fetchOptionsQteMoins1 = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify({
      id: medicament.id,
      qte: medicament.qte - 1
    })
  };
  fetch(urlQteMoins1, fetchOptionsQteMoins1)
    .then(response => response.json())
    .then(dataJson => {
      getMedicaments();
    })
    .catch(error => {
      console.error("Erreur mise à jour quantité :", error);
    });
}
function trierParDenomination() {
  if (triActif.value.type === 'denomination') {
    triActif.value.direction = triActif.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    triActif.value.type = 'denomination';
    triActif.value.forme = false;
    triActif.value.denomination = true;
    triActif.value.quantite = false;
    triActif.value.direction = 'asc';
  }
  appliquerTri();
}
function trierParQuantite() {
  if (triActif.value.type === 'quantite') {
    triActif.value.direction = triActif.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    triActif.value.type = 'quantite';
    triActif.value.forme = false;
    triActif.value.denomination = false;
    triActif.value.quantite = true;
    triActif.value.direction = 'asc';
  }
  appliquerTri();
}
function trierParForme() {
  if (triActif.value.type === 'forme') {
    triActif.value.direction = triActif.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    triActif.value.type = 'forme';
    triActif.value.forme = true;
    triActif.value.denomination = false;
    triActif.value.quantite = false;
    triActif.value.direction = 'asc';
  }
  appliquerTri();
}
function appliquerTri() {
  const direction = triActif.value.direction;
  if (triActif.value.type === 'denomination') {
    listeMedicaments.sort((a, b) => {
      const compare = a.getDenomination().localeCompare(b.getDenomination());
      return direction === 'asc' ? compare : -compare;
    });
  } else if (triActif.value.type === 'quantite') {
    listeMedicaments.sort((a, b) => {
      return direction === 'asc' ? a.qte - b.qte : b.qte - a.qte;
    });
  } else if (triActif.value.type === 'forme') {
    listeMedicaments.sort((a, b) => {
      const compare = a.getFormePharmaceutique().localeCompare(b.getFormePharmaceutique());
      return direction === 'asc' ? compare : -compare;
    });
  }
}
function annulerTri() {
  triActif.value.type = null;
  triActif.value.denomination = false;
  triActif.value.quantite = false;
  triActif.value.direction = 'asc';
  getMedicaments();
}
</script>

<template>
  <div class="conteneur">
    <TriEtRecherche @trierDenomination="trierParDenomination" @trierQuantite="trierParQuantite"
      @trierForme="trierParForme" @annulerTri="annulerTri" @BarreDeRecherche="barreDeRecherche = $event" />
    <ul class="liste-des-medocs">
      <ItemMedicament v-for="(medicament, index) in medicamentsFiltres" :key="medicament.id" :index="index"
        :medicament="medicament" :listeFormesPharmaceutiques="listeFormesPharmaceutiques"
        @supprimermedicament="supprimerMedicament" @quantiteplusun="QuantitePlusUn" @quantitemoinsun="QuantiteMoinsUn"
        @getMedicaments="getMedicaments" />
    </ul>
    <div class="section-ajout-medoc">
      <div v-if="ajout">
        <button @click="ajout = false" class="bouton-annuler">Annuler</button>
        <AjouterMedicament :listeMedicaments="listeMedicaments" :listeFormesPharmaceutiques="listeFormesPharmaceutiques"
          @ajoutReussi="() => { ajout = false; getMedicaments(); }" />
      </div>
      <div v-else>
        <button @click="ajout = true" class="bouton-ajout">Ajouter un médicament</button>
      </div>
    </div>
    <div v-if="!ajoutForme">
      <button @click="ajoutForme = true" class="bouton-ajout">Ajouter une forme</button>
      <p v-if="succesAjoutForme" class="succes">{{ succesAjoutForme }}</p>
    </div>
    <div v-else>
      <button @click="ajoutForme = false" class="bouton-annuler">Annuler</button>
      <AjouterFormePharmaceutique :listeFormesPharmaceutiques="listeFormesPharmaceutiques" @formeAjoutee="forme => {
        succesAjoutForme = `Forme '${forme}' ajoutée !`;
        ajoutForme = false;
      }" />
    </div>
    <div class="SectionJeu">
      <JeuDuMedicament />
    </div>
  </div>
</template>
<style scoped>
.conteneur {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.liste-des-medocs {
  list-style: none;
  padding: 0;
}

.section-ajout-medoc {
  margin-top: 20px;
}

.bouton-ajout {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  margin-top: 10px;
  margin-bottom: 5px;
  cursor: pointer;
}

.bouton-ajout:hover {
  background-color: #218838;
}

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
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.bouton-envoi {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.bouton-envoi:hover {
  background-color: #218838;
}

.bouton-annuler {
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  margin-top: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}

.bouton-annuler:hover {
  background-color: #c82333;
}

.SectionJeu {
  margin-top: 20px;
}

.erreur {
  color: #c82333;
}

.succes {
  color: #28a745;
}
</style>