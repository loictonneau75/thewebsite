import {clear} from "./form/form_constants.js";
import { capitalize } from "./form/form_constants.js";
import { FIELD_IDS } from "./form/form_constants.js";

/**
 * Crée un message indiquant qu'aucun thé n'est enregistré.
 *
 * @function createNoTeasMessage
 * @returns {HTMLParagraphElement} Un élément `<p>` contenant le message.
 */
function createNoTeasMessage() {
    const p = document.createElement("p");
    p.innerText = "Aucun thé enregistré.";
    return p;
}

/**
 * Crée un élément HTML de paragraphe contenant une propriété d'un thé,
 * affichée sous la forme : <strong>Nom :</strong> valeur.
 *
 * La première lettre du label est automatiquement mise en majuscule,
 * et un ":" est ajouté après, pour un affichage homogène.
 *
 * @function createTeaPropertyLine
 * @param {string} label - Le nom du champ à afficher (ex : "type", "marque", "ingrédients").
 * @param {string} value - La valeur associée à ce champ.
 * @returns {HTMLParagraphElement} Un élément <p> contenant le texte mis en forme.
 *
 * @example
 * const el = createTeaPropertyLine("marque", "Lipton");
 * // <p><strong>Marque :</strong> Lipton</p>
 */
function createTeaPropertyLine(label, value){
    const propertyLine = document.createElement("p")
    propertyLine.innerHTML = `<strong>${capitalize(label.slice(0,-1))} :</strong> ${value}`
    return propertyLine
}

/**
 * Remplace dynamiquement un bouton de suppression par une confirmation inline avec deux options :
 * - "Oui" : supprime le thé correspondant via `confirmDeletion(index)`.
 * - "Annuler" : restaure le bouton de suppression initial.
 *
 * Cette approche remplace l'utilisation d'un modal par une interaction fluide directement dans la carte.
 *
 * @function showInlineConfirmation
 * @param {HTMLElement} container - Le conteneur HTML dans lequel afficher la confirmation inline.
 * @param {number} index - L'index du thé à supprimer dans le tableau des thés.
 *
 * @example
 * showInlineConfirmation(deleteContainerElement, 2);
 */
function showInlineConfirmation(container, index) {
    container.innerHTML = ''; // vider l'ancien bouton

    const text = document.createElement("span");
    text.textContent = "Supprimer ce thé ? ";
    container.appendChild(text);

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "Oui";
    confirmBtn.classList.add("btn", "btn-danger", "btn-sm", "me-2");
    confirmBtn.addEventListener("click", () => {
        confirmDeletion(index);
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Annuler";
    cancelBtn.classList.add("btn", "btn-secondary", "btn-sm");
    cancelBtn.addEventListener("click", () => {
        container.innerHTML = '';
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Supprimer";
        deleteBtn.classList.add("btn", "btn-outline-danger", "btn-sm");
        deleteBtn.addEventListener("click", () => showInlineConfirmation(container, index));
        container.appendChild(deleteBtn);
    });

    container.append(confirmBtn, cancelBtn);
}

/**
 * Crée une carte HTML pour afficher les informations d'un thé.
 *
 * @function createTeaCard
 * @param {Object} tea - L'objet représentant un thé.
 * @param {number} index - L'index du thé dans la liste pour permettre sa suppression.
 * @returns {HTMLDivElement} Un div contenant toutes les informations du thé et un bouton de suppression.
 */
function createTeaCard(tea, index) {
    const card = document.createElement("div");
    card.classList.add("card")

    const body = document.createElement("div");
    body.classList.add("card-body")

    const name = document.createElement("h5");
    name.innerText = tea.name;
    name.classList.add("card-title")
    
    const type = document.createElement("h6")
    type.innerText = tea.type
    type.classList.add("card-subtitle", "text-body-secondary")

    const brand = createTeaPropertyLine(FIELD_IDS.brands, tea.brand)
    brand.classList.add("card-subtitle")
    const ingredients = createTeaPropertyLine(FIELD_IDS.ingredients, tea.ingredients.join(", "))
    ingredients.classList.add("card-subtitle")
    const comment = createTeaPropertyLine(FIELD_IDS.comments, tea.comment)
    comment.classList.add("card-subtitle")
    
    const deleteContainer = document.createElement("div");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.classList.add("btn", "btn-outline-danger", "btn-sm", "no-border");
    deleteBtn.addEventListener("click", () => showInlineConfirmation(deleteContainer, index));
    deleteContainer.appendChild(deleteBtn)

    body.append(name, type, brand, ingredients,comment, deleteContainer)
    
    


    card.appendChild(body)
    return card;
}

/**
 * Affiche tous les thés enregistrés dans le localStorage dans un conteneur.
 * Utilise `clear` pour vider l'ancien affichage et reconstruit tout proprement.
 *
 * @function displayTeas
 * @exports
 * @returns {HTMLDivElement} Le conteneur HTML contenant tous les thés affichés.
 */
export function displayTeas() {
    const teaView = document.createElement("div");
    teaView.classList.add("tea-carousel", "py-5");
    const teas = JSON.parse(localStorage.getItem("teas")) || [];
    clear(teaView);
    if (teas.length === 0) {
        teaView.appendChild(createNoTeasMessage());
    } else {
        teas.forEach((tea, index) => {
            const teaCard = createTeaCard(tea, index);
            teaView.appendChild(teaCard);
        });
        initializeSlick(teaView);
    }
    
    return teaView;
}

/**
 * Initialise le carrousel Slick sur un élément spécifié.
 * Cette fonction applique Slick à l'élément passé en paramètre (teaView) et configure les paramètres de défilement,
 * notamment le nombre d'éléments visibles et le comportement responsive en fonction de la taille de l'écran.
 * 
 * @param {HTMLElement} teaView - L'élément DOM sur lequel le carrousel Slick sera initialisé.
 * L'élément doit contenir les éléments à faire défiler (par exemple, des cartes de thé).
 * 
 * @example
 * // Initialiser le carrousel sur un élément teaView
 * initializeSlick(document.getElementById('teaViewWrapper'));
 * 
 * @see {@link https://kenwheeler.github.io/slick/} pour plus d'informations sur la bibliothèque Slick.
 */
function initializeSlick(teaView) {
    $(teaView).slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        },{
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });
}


/**
 * Confirme la suppression d'un thé et met à jour le localStorage, 
 * puis recharge la page pour actualiser les données.
 *
 * @function confirmDeletion
 * @param {number} index - L'index du thé à supprimer.
 * @param {HTMLElement} modal - Le modal de confirmation à fermer après suppression.
 */
function confirmDeletion(index){
    let teas = JSON.parse(localStorage.getItem("teas")) || [];
        if (index >= 0 && index < teas.length) {
            const teaToRemove = teas[index];
            teas.splice(index, 1);
            localStorage.setItem("teas", JSON.stringify(teas));
            updateAvailableLists(teas, teaToRemove);
            location.reload()
        }
}

/**
 * Met à jour les listes stockées dans le localStorage
 * en supprimant les types, marques ou ingrédients devenus inutilisés.
 *
 * @function updateAvailableLists
 * @param {Array<Object>} teas - Le tableau des thés restants.
 * @param {Object} removedTea - Le thé supprimé pour vérifier ses propriétés.
 */
function updateAvailableLists(teas, removedTea) {
    updateList(teas, removedTea.type, "typesAvailable", tea => tea.type);
    updateList(teas, removedTea.brand, "brandsAvailable", tea => tea.brand);
    removedTea.ingredients.forEach(ingredient => {
        updateList(teas, ingredient, "ingredientsAvailable", tea => tea.ingredients);
    });
}

/**
 * Met à jour une liste spécifique dans le localStorage
 * en supprimant une valeur si elle n'est plus utilisée dans les thés existants.
 *
 * @function updateList
 * @param {Array<Object>} teas - Le tableau des thés restants.
 * @param {string} value - La valeur à vérifier et potentiellement supprimer.
 * @param {string} storageKey - La clé du localStorage pour la liste à mettre à jour.
 * @param {Function} extractor - Fonction pour extraire la valeur depuis un thé (type, marque, ingrédients).
 */
function updateList(teas, value, storageKey, extractor) {
    const allValues = teas.map(extractor).flat();
    if (!allValues.includes(value)) {
        const stored = JSON.parse(localStorage.getItem(storageKey)) || [];
        const updated = stored.filter(item => item !== value);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    }
}
