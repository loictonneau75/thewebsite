import { createInputField, createInputWithOptions, createSubmitBtn, one_choice, multiplechoice, addIngredient, showSuggestions} from "./form_creators.js";
import {saveTeaToLocalStorage, updateAvailableChoices} from "./form_storage.js"
import { FIELD_IDS, LOCAL_STORAGE_KEYS, clear, createrowwithcolumns} from "./form_constants.js";


/**
 * Configure l'événement d'entrée (input) pour afficher dynamiquement
 * des suggestions d'ingrédients en fonction de la saisie utilisateur.
 *
 * @function setupInputHandlers
 * @export
 * @param {Array<string>} options - Liste complète des ingrédients disponibles.
 * @param {HTMLInputElement} input - Le champ de saisie sur lequel écouter l'événement "input".
 * @param {Array<string>} selectedChoices - Liste actuelle des ingrédients sélectionnés (à exclure des suggestions).
 * @param {HTMLElement} suggestionsContainer - Le conteneur HTML où afficher les suggestions filtrées.
 *
 * @example
 * setupInputHandlers(["Menthe", "Citron"], inputElement, selectedChoices, suggestionsContainer);
 */
export function setupInputHandlers(options, input, selectedChoices, suggestionsContainer){
    input.addEventListener("input", () => {
        showSuggestions(options, input, selectedChoices, suggestionsContainer);
      });
}

/**
 * Configure la navigation au clavier pour parcourir et sélectionner
 * les suggestions avec les touches fléchées (↑, ↓) et Entrée.
 *
 * @function setupKeyboardNavigation
 * @exports
 * @param {HTMLInputElement} input - Le champ de saisie écoutant les événements clavier.
 * @param {HTMLElement} suggestionsContainer - Le conteneur contenant les suggestions visibles.
 *
 * @example
 * setupKeyboardNavigation(inputElement, document.getElementById("suggestions-container"));
 *
 * - Flèche bas (↓) : déplace la sélection vers le bas.
 * - Flèche haut (↑) : déplace la sélection vers le haut.
 * - Entrée : sélectionne l'élément actuellement surligné.
 */
export function setupKeyboardNavigation(input, suggestionsContainer){
    let currentIndex = -1;
    input.addEventListener("keydown", event => {
        const items = suggestionsContainer.querySelectorAll(".suggestion-item");
        if (!items.length) {return};
        if (event.key === "ArrowDown") {
            event.preventDefault();
            currentIndex = (currentIndex + 1) % items.length;
            items.forEach((it, i) => it.classList.toggle("highlight", i === currentIndex));
        }
        else if (event.key === "ArrowUp") {
            event.preventDefault();
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            items.forEach((it, i) => it.classList.toggle("highlight", i === currentIndex));
        }
        else if (event.key === "Enter") {
            event.preventDefault();
            if (currentIndex >= 0) {
                input.value = items[currentIndex].textContent;
                clear(suggestionsContainer);
                currentIndex = -1;
            }
        }
    });
}

/**
 * Configure l'événement de clic sur le bouton d'ajout d'ingrédient.
 * Lorsqu'on clique, l'ingrédient saisi est ajouté à la liste des choix sélectionnés,
 * et le champ de saisie ainsi que les suggestions sont nettoyés.
 *
 * @function setupAddButton
 * @export
 * @param {HTMLButtonElement} button - Le bouton sur lequel écouter l'événement "click".
 * @param {Array<string>} selectedChoices - Liste actuelle des ingrédients sélectionnés.
 * @param {HTMLElement} choiceContainer - Conteneur HTML où afficher les ingrédients sous forme de pills.
 * @param {HTMLInputElement} input - Le champ de saisie de l'ingrédient.
 * @param {HTMLElement} suggestionsContainer - Conteneur des suggestions à vider après ajout.
 *
 * @example
 * setupAddButton(addButton, selectedChoices, pillsContainer, inputElement, suggestionsContainer);
 */
export function setupAddButton(button, selectedChoices, choiceContainer, input, suggestionsContainer){
    button.addEventListener("click", () =>
        addIngredient(selectedChoices, choiceContainer, input, suggestionsContainer)
    );
}

/**
 * Active ou désactive dynamiquement l'affichage et la validation d'un champ "Autre" 
 * en fonction de la sélection d'une option spécifique dans un `<select>`.
 *
 * @function bindOtherToggle
 * @export
 * @param {HTMLSelectElement} select - L'élément select à surveiller.
 * @param {HTMLInputElement} otherInput - Le champ input à afficher ou cacher si "autre" est sélectionné.
 *
 * @example
 * bindOtherToggle(document.getElementById("types-select"), document.getElementById("types"));
 */
export function bindOtherToggle(select, otherInput) {
    select.addEventListener('change', () => {
        const isOtherSelected = select.value === 'autre';
        otherInput.style.display = isOtherSelected ? 'block' : 'none';
        otherInput.required = isOtherSelected;
    });
}

/**
 * Récupère la valeur sélectionnée dans un `<select>`, ou la valeur saisie dans un `<input>` si "autre" est choisi.
 *
 * @function getSelectedOrInputValue
 * @param {string} selector - Le sélecteur CSS de base du champ (sans "-select" pour l'input).
 * @returns {string} La valeur sélectionnée ou saisie, ou une chaîne vide si aucune valeur n'est trouvée.
 *
 * @example
 * const type = getSelectedOrInputValue("#types");
 * console.log(type); // "Thé Vert" ou valeur saisie manuellement
 */
function getSelectedOrInputValue(selector) {
    const select = document.querySelector(`${selector}-select`);
    if (select && select.value !== "" && select.value !== "autre") {
        return select.value;
    }
    const input = document.querySelector(`${selector}`);
    return input ? input.value.trim() : "";
}

/**
 * Crée un objet représentant un thé à partir des données du formulaire et des ingrédients sélectionnés.
 *
 * @function createTeaObject
 * @param {HTMLFormElement} form - Le formulaire contenant les informations du thé.
 * @param {Array<string>} ingredients - La liste des ingrédients sélectionnés.
 * @returns {Object} Un objet représentant un thé avec ses propriétés :
 * - `name` {string} : Le nom du thé.
 * - `type` {string} : Le type du thé.
 * - `brand` {string} : La marque du thé.
 * - `ingredients` {Array<string>} : La liste des ingrédients.
 * - `comment` {string} : Le commentaire associé au thé.
 *
 * @example
 * const tea = createTeaObject(document.getElementById("formulaire-the"), ["Menthe", "Citron"]);
 * console.log(tea);
 */
function createTeaObject(form, ingredients) {
    return {
        name: form.querySelector("#name").value.trim(),
        type: getSelectedOrInputValue(`#${FIELD_IDS.types}`),
        brand: getSelectedOrInputValue("#brands"),
        ingredients: ingredients,
        comment: form.querySelector("#comments_container").value.trim()
    };
}

/**
 * Valide que l'utilisateur a sélectionné au moins un ingrédient.
 * 
 * Si aucun ingrédient n'est sélectionné, une erreur personnalisée est définie sur l'élément.
 *
 * @function validateIngredients
 * @param {Array<string>} pills - Liste des ingrédients actuellement sélectionnés.
 * @param {HTMLElement} ingredientsInput - Le champ ou conteneur d'ingrédients à valider.
 *
 * @example
 * validateIngredients(["Menthe", "Citron"], document.getElementById("ingredients_container"));
 */
function validateIngredients(pills, ingredientsInput) {
    if (pills.length === 0) {
        ingredientsInput.setCustomValidity("Veuillez ajouter au moins 1 ingrédient.");
    } else {
        ingredientsInput.setCustomValidity("");
    }
}

/**
 * Gère la soumission du formulaire :
 * - Empêche le rechargement par défaut.
 * - Valide qu'au moins un ingrédient est sélectionné.
 * - Si le formulaire est valide, crée un objet thé, le sauvegarde dans le localStorage,
 *   met à jour les choix disponibles, réinitialise le formulaire et recharge la page.
 * - Sinon, affiche les erreurs de validation.
 *
 * @function handleFormSubmission
 * @param {Event} e - L'événement de soumission du formulaire.
 * @param {HTMLFormElement} form - Le formulaire contenant les données du thé.
 * @param {HTMLElement} ingredientsInput - Le champ ou conteneur d'ingrédients pour la validation personnalisée.
 * @param {HTMLElement} pillsContainer - Le conteneur contenant les ingrédients sélectionnés sous forme de pills.
 *
 * @example
 * formElement.addEventListener("submit", (e) => handleFormSubmission(e, formElement, ingredientsInput, pillsContainer));
 */
function handleFormSubmission(e, form, ingredientsInput, pillsContainer) {
    e.preventDefault();
    const pills = Array.from(pillsContainer.querySelectorAll(".ingredient-pill")).map(pill => pill.textContent.trim());
    validateIngredients(pills, ingredientsInput);
    if (form.checkValidity()) {
        const tea = createTeaObject(form, pills)
        console.log(tea)
        saveTeaToLocalStorage(tea);
        updateAvailableChoices(tea);
        form.reset();
        document.getElementById("pills-container").innerHTML = "";
        location.reload()
    } else {
        form.reportValidity();
    }
}

/**
 * Récupère les éléments principaux du formulaire nécessaires à la gestion des interactions.
 *
 * @function getFormElements
 * @returns {Object} Un objet contenant :
 * - `form` {HTMLFormElement} : Le formulaire principal.
 * - `submitBtn` {HTMLButtonElement} : Le bouton de soumission du formulaire.
 * - `ingredientsInput` {HTMLElement} : Le conteneur des ingrédients sélectionnés.
 * - `pillsContainer` {HTMLElement} : Le conteneur affichant les pills d'ingrédients.
 *
 * @example
 * const { form, submitBtn, ingredientsInput, pillsContainer } = getFormElements();
 */
function getFormElements() {
    const form = document.getElementById("formulaire-the");
    const submitBtn = form.querySelector("button[type='submit']");
    const ingredientsInput = document.getElementById(FIELD_IDS.ingredients);
    const pillsContainer = document.getElementById("pills-container");
    return { form, submitBtn, ingredientsInput, pillsContainer };
}

/**
 * Attache le gestionnaire de soumission au bouton "Envoyer" du formulaire.
 * 
 * Lors d'un clic sur le bouton de soumission, la fonction `handleFormSubmission`
 * est appelée pour gérer la validation, l'enregistrement du thé et la réinitialisation du formulaire.
 *
 * @function attachFormHandler
 * @exports
 *
 * @example
 * import { attachFormHandler } from "./form.js";
 * attachFormHandler();
 */
export function attachFormHandler() {
    const { form, submitBtn, ingredientsInput, pillsContainer } = getFormElements();
    submitBtn.addEventListener("click", e => {
        handleFormSubmission(e, form, ingredientsInput, pillsContainer);
    });
}

/**
 * Crée dynamiquement le formulaire complet pour ajouter un thé :
 * - Champ pour le nom du thé.
 * - Sélection ou saisie libre pour le type.
 * - Sélection ou saisie libre pour la marque.
 * - Sélection multiple pour les ingrédients.
 * - Champ pour ajouter un commentaire.
 * - Bouton de soumission.
 *
 * @function create_form
 * @exports
 * @returns {HTMLFormElement} Le formulaire HTML complet prêt à être inséré dans la page.
 *
 * @example
 * import { create_form } from "./form.js";
 * document.body.appendChild(create_form());
 */
export function create_form() {
    const form = document.createElement("form");
    form.id = "formulaire-the";
    form.autocomplete = "off";
    form.appendChild(createrowwithcolumns([
        createInputField("input", FIELD_IDS.name, "Nom du Thé :",null, true),
        createInputWithOptions(LOCAL_STORAGE_KEYS.typesAvailable, "Type :", FIELD_IDS.types, "Entrez un type", one_choice, true)
    ]))
    form.appendChild(createrowwithcolumns([
        createInputWithOptions(LOCAL_STORAGE_KEYS.brandsAvailable, "Marque :", FIELD_IDS.brands, "Entrez une marque", one_choice, false),
        createInputWithOptions(LOCAL_STORAGE_KEYS.ingredientsAvailable, "Ingredient :", FIELD_IDS.ingredients, "Entrez un ingredient", multiplechoice, true)
    ]))
    form.appendChild(createrowwithcolumns([createInputField("textarea", FIELD_IDS.comments, "Ton commentaire :",2, false)]))
    form.appendChild(createrowwithcolumns([createSubmitBtn()]))
    return form;
}

