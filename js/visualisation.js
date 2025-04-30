import {clear} from "./form/form_constants.js";
import {create_modal} from "./confirm_modal.js";

/**
 * Crée un élément de titre pour la section "Liste de mes thés".
 *
 * @function createTeasHeader
 * @returns {HTMLHeadingElement} Un élément `<h2>` contenant le titre.
 */
function createTeasHeader() {
    const h2 = document.createElement("h2");
    h2.innerText = "Liste de mes thés";
    return h2;
}

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
 * Crée une carte HTML pour afficher les informations d'un thé.
 *
 * @function createTeaCard
 * @param {Object} tea - L'objet représentant un thé.
 * @param {number} index - L'index du thé dans la liste pour permettre sa suppression.
 * @returns {HTMLDivElement} Un div contenant toutes les informations du thé et un bouton de suppression.
 */
function createTeaCard(tea, index) {
    const card = document.createElement("div");
    card.classList.add("tea-card");
    const name = document.createElement("h3");
    name.innerText = tea.name;
    const type = document.createElement("p");
    type.innerHTML = `<strong>Type :</strong> ${tea.type}`;
    const brand = document.createElement("p");
    brand.innerHTML = `<strong>Marque :</strong> ${tea.brand}`;
    const ingredients = document.createElement("p");
    ingredients.innerHTML = `<strong>Ingrédients :</strong> ${tea.ingredients.join(", ")}`;
    const comment = document.createElement("p");
    comment.innerHTML = `<strong>Commentaire :</strong> ${tea.comment}`;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.addEventListener("click", () => deleteTea(index));
    card.appendChild(name);
    card.appendChild(type);
    card.appendChild(brand);
    card.appendChild(ingredients);
    card.appendChild(comment);
    card.appendChild(deleteBtn);
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
    teaView.classList.add("thé_view")
    const teas = JSON.parse(localStorage.getItem("teas")) || [];;
    clear(teaView);
    teaView.appendChild(createTeasHeader());
    if (teas.length === 0) {
        teaView.appendChild(createNoTeasMessage());
    } else {
        teas.forEach((tea, index) => {
            const teaCard = createTeaCard(tea, index);
            teaView.appendChild(teaCard);
        });
    }
    return teaView;
}

/**
 * Confirme la suppression d'un thé et met à jour le localStorage, 
 * puis recharge la page pour actualiser les données.
 *
 * @function confirmDeletion
 * @param {number} index - L'index du thé à supprimer.
 * @param {HTMLElement} modal - Le modal de confirmation à fermer après suppression.
 */
function confirmDeletion(index, modal){
    let teas = JSON.parse(localStorage.getItem("teas")) || [];
        if (index >= 0 && index < teas.length) {
            const teaToRemove = teas[index];
            teas.splice(index, 1);
            localStorage.setItem("teas", JSON.stringify(teas));
            updateAvailableLists(teas, teaToRemove);
            document.body.removeChild(modal);
            location.reload()
        }
}

/**
 * Affiche un modal de confirmation pour supprimer un thé.
 * 
 * Lorsqu'un utilisateur clique sur le bouton "Supprimer" d'une carte :
 * - Un modal est affiché pour confirmer ou annuler la suppression.
 * - Si l'utilisateur confirme, la fonction `confirmDeletion` est appelée pour supprimer le thé.
 * - Si l'utilisateur annule, le modal est simplement fermé sans action supplémentaire.
 *
 * @function deleteTea
 * @param {number} index - L'index du thé à supprimer dans le tableau des thés.
 *
 * @example
 * deleteTea(2); // Affiche un modal pour confirmer la suppression du 3ème thé
 */
function deleteTea(index) {
    console.log(index)
    const modal = create_modal();
    document.body.appendChild(modal);
    const confirmBtn = modal.querySelector("#confirm_suppression");
    confirmBtn.addEventListener("click", () => {confirmDeletion(index, modal)});
    const cancelBtn = modal.querySelector("#undo_suppression");
    cancelBtn.addEventListener("click", () => {document.body.removeChild(modal)});
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
