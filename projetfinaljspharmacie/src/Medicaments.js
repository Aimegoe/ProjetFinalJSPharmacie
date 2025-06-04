export class Medicament {
    constructor(id, denomination, formepharmaceutique, photo, qte) {
        this.id = id;
        this.denomination = denomination;
        this.formepharmaceutique = formepharmaceutique;
        this.photo = photo;
        this.qte = qte;
    }

    //Getters
    getId() {
        return this.id;
    }
    getDenomination() {
        return this.denomination;
    }
    getFormePharmaceutique() {
        return this.formepharmaceutique;
    }
    getPhoto() {
        return this.photo;
    }
    getQte() {
        return this.qte;
    }


    afficheMedicament() {
        return `${this.denomination}, sous la forme de ${this.formepharmaceutique}. Quantité: ${this.qte}`;
    }
}
export default Medicament