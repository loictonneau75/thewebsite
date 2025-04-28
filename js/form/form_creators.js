import { getDataFromLocalStorage } from "./form_storage.js";
import { bindOtherToggle , setupInputHandlers, setupKeyboardNavigation, setupAddButton} from "./form_handlers.js";
import { clear, capitalize} from "./form_constants.js";


// ---------------------------------------------
// Fonctions de base (création d'éléments simples)
// ---------------------------------------------

/**
 * Crée un élément d'entrée de formulaire (`input` ou `textarea`) avec des propriétés personnalisées.
 *
 * @function createInputElement
 * @param {string} tag - Le type d'élément à créer ("input" ou "textarea").
 * @param {string} id - L'ID à attribuer à l'élément.
 * @param {string} placeholder - Le texte d'indication (placeholder) à afficher.
 * @param {string} inputType - Le type de l'input (ex: "text", "email", etc.). Ignoré si c'est un `textarea`.
 * @param {number|null} rows - Le nombre de lignes pour un `textarea` (peut être `null` pour un `input`).
 * @param {Object} style - Un objet contenant les styles CSS à appliquer à l'élément.
 * @returns {HTMLElement} L'élément HTML créé et configuré.
 *
 * @example
 * createInputElement("input", "tea-name", "Entrez le nom", "text", null, { marginBottom: "10px" });
 * createInputElement("textarea", "tea-comment", "Votre commentaire", "", 5, {});
 */
function createInputElement(tag , id, placeholder, inputType, rows) {
    const element = document.createElement(tag);
    element.id = id;
    if (tag === "textarea") {
        element.rows = rows;
    }else{
        element.type = inputType;
        element.placeholder = placeholder;
    }
    return element;
}

/**
 * Crée un élément `<label>` HTML lié à un champ de formulaire.
 *
 * @function makeLabel
 * @param {string} forId - L'ID de l'élément de formulaire que le label doit cibler.
 * @param {string} text - Le texte à afficher dans le label.
 * @returns {HTMLLabelElement} L'élément label HTML créé.
 *
 * @example
 *  makeLabel("tea-name", "Nom du Thé :");
 */
function makeLabel(forId, text) {
    const label = document.createElement("label");
    label.htmlFor = forId;
    label.innerText = text;
    return label;
}

/**
 * Crée un élément `<select>` HTML avec un ID optionnel.
 *
 * @function makeSelect
 * @param {string} id - L'ID à attribuer à l'élément select (facultatif).
 * @returns {HTMLSelectElement} L'élément select HTML créé.
 *
 * @example
 * const select = makeSelect("type-select");
 * document.body.appendChild(select);
 */
function makeSelect(id) {
    const select = document.createElement('select');
    if (id) select.id = id;
    return select;
}

/**
 * Crée un élément `<option>` pour un `<select>`, avec des propriétés personnalisées.
 *
 * @function makeOption
 * @param {Object} params - Les paramètres pour configurer l'option.
 * @param {string} params.value - La valeur de l'option.
 * @param {string} params.text - Le texte affiché pour l'option.
 * @param {boolean} [params.disabled=false] - Indique si l'option doit être désactivée.
 * @param {boolean} [params.selected=false] - Indique si l'option doit être sélectionnée par défaut.
 * @returns {HTMLOptionElement} L'élément option HTML créé.
 *
 * @example
 * const opt = makeOption({ value: "green-tea", text: "Thé Vert" });
 * document.querySelector("select").appendChild(opt);
 */
function makeOption({value, text, disabled = false, selected = false}) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    if (disabled) option.disabled = true;
    if (selected) option.selected = true;
    return option;
}

/**
 * Crée un conteneur `<div>` contenant un label associé à un champ de formulaire.
 *
 * @function makeLabeledWrapper
 * @param {string} forId - L'ID de l'élément de formulaire auquel le label doit être associé.
 * @param {string} labelText - Le texte à afficher dans le label.
 * @returns {HTMLDivElement} Le conteneur div contenant le label.
 *
 * @example
 * const wrapper = makeLabeledWrapper("name", "Nom du thé :");
 * document.body.appendChild(wrapper);
 */
function makeLabeledWrapper(forId, labelText) {
    const wrapper = document.createElement("div");
    const label = document.createElement("label");
    label.htmlFor = forId;
    label.innerText = labelText;
    wrapper.appendChild(label);
    return wrapper;
}

/**
 * Crée un bouton de soumission pour un formulaire.
 *
 * @function createSubmitBtn
 * @exports
 * @returns {HTMLButtonElement} Le bouton de type "submit" avec le texte "Envoyer".
 *
 * @example
 * const submitButton = createSubmitBtn();
 * document.getElementById("formulaire-the").appendChild(submitButton);
 */
export function createSubmitBtn(){
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Envoyer";
    return submitBtn
}

// ---------------------------------------------
// Fonctions de création de champs plus complexes
// ---------------------------------------------

/**
 * Crée un élément `<select>` rempli d'options, avec une option par défaut (placeholder).
 *
 * @function createSelectWithOptions
 * @param {Array<string>} options - La liste des valeurs pour créer les options du select.
 * @param {string} placeholder - Le texte à afficher comme première option (désactivée et sélectionnée).
 * @param {string} ID - L'ID à attribuer au select (avec "-select" ajouté automatiquement).
 * @returns {HTMLSelectElement} L'élément select HTML créé avec ses options.
 *
 * @example
 * const typesSelect = createSelectWithOptions(["Thé Vert", "Thé Noir"], "Sélectionnez un type", "types");
 * document.body.appendChild(typesSelect);
 */
function createSelectWithOptions(options, placeholder, ID) {
    const select = makeSelect(`${ID}-select`);
    const defaultOpt = makeOption({value:'', text:placeholder, disabled: true, selected: true});
    select.appendChild(defaultOpt);
    options.forEach(value => {select.appendChild(makeOption({ value: value, text: value }))});
    return select;
}

/**
 * Crée un champ de formulaire complet avec un label et un input (ou textarea).
 *
 * @function createInputField
 * @exports
 * @param {string} fieldTag - Le type d'élément à créer ("input" ou "textarea").
 * @param {string} fieldId - L'ID à attribuer au champ.
 * @param {string} labelText - Le texte du label associé au champ.
 * @param {number|null} rows - Le nombre de lignes si c'est un `textarea` (null pour un `input`).
 * @param {boolean} required - Indique si le champ doit être obligatoire (`required`).
 * @returns {HTMLDivElement} Un élément `div` contenant le label et le champ de formulaire.
 *
 * @example
 * createInputField("input", "tea-name", "Nom du Thé :", null, true);
 * createInputField("textarea", "tea-comment", "Commentaire :", 4, false);
 */
export function createInputField(fieldTag, fieldId, labelText, rows, required) {
    const wrapper = document.createElement("div");
    const label = makeLabel(fieldId, labelText);
    const input = createInputElement(fieldTag, fieldId, "", "text", rows);
    input.required = required
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return wrapper;
}


// ---------------------------------------------
// Fonctions liées à la sélection multiple
// ---------------------------------------------

/**
 * Crée les conteneurs nécessaires pour une sélection multiple :
 * - Un conteneur pour afficher les suggestions.
 * - Un conteneur pour afficher les choix sélectionnés sous forme de pills.
 *
 * @function makeMultiChoiceContainers
 * @returns {Object} Un objet contenant :
 * - `suggestionsContainer` {HTMLDivElement} : Le conteneur des suggestions.
 * - `choiceContainer` {HTMLDivElement} : Le conteneur des ingrédients sélectionnés.
 *
 * @example
 * const { suggestionsContainer, choiceContainer } = makeMultiChoiceContainers();
 * document.body.appendChild(suggestionsContainer);
 * document.body.appendChild(choiceContainer);
 */
function makeMultiChoiceContainers() {
    const suggestionsContainer = document.createElement("div");
    suggestionsContainer.classList.add("suggestions-container");
    const choiceContainer = document.createElement("div");
    choiceContainer.id = "pills-container";
    return { suggestionsContainer, choiceContainer };
}

/**
 * Crée les contrôles pour la sélection multiple :
 * - Un champ de saisie pour entrer un ingrédient.
 * - Un bouton pour ajouter l'ingrédient à la liste des choix sélectionnés.
 *
 * @function makeMultiChoiceControls
 * @param {string} inputId - L'ID à attribuer au champ de saisie.
 * @param {string} placeholder - Le texte d'indication à afficher dans le champ de saisie.
 * @returns {Object} Un objet contenant :
 * - `input` {HTMLInputElement} : Le champ de saisie pour les ingrédients.
 * - `button` {HTMLButtonElement} : Le bouton pour ajouter un ingrédient.
 *
 * @example
 * const { input, button } = makeMultiChoiceControls("ingredients", "Entrez un ingrédient");
 * document.body.appendChild(input);
 * document.body.appendChild(button);
 */
function makeMultiChoiceControls(inputId, placeholder) {
    const input = createInputElement("input", inputId, placeholder, "text", null);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Ajouter";
    return {input, button};
}

/**
 * Crée un élément visuel ("pill") représentant un ingrédient sélectionné,
 * avec un bouton pour permettre sa suppression.
 *
 * @function createIngredientPill
 * @param {string} ingredient - Le nom de l'ingrédient à afficher dans la pill.
 * @param {Function} onRemove - La fonction à exécuter lorsqu'on clique sur le bouton de suppression.
 * @returns {HTMLDivElement} L'élément div représentant la pill d'ingrédient.
 *
 * @example
 * const pill = createIngredientPill("Menthe", () => console.log("Pill supprimée"));
 * document.getElementById("pills-container").appendChild(pill);
 */
function createIngredientPill(ingredient, onRemove) {
    const pill = document.createElement('div');
    const span = document.createElement('span');
    span.classList.add("ingredient-pill")
    span.textContent = ingredient;
    pill.appendChild(span);
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', onRemove);
    pill.appendChild(closeBtn);
    return pill;
}

/**
 * Affiche toutes les "pills" d'ingrédients sélectionnés dans un conteneur donné.
 * Chaque pill est recréée avec un bouton permettant sa suppression.
 *
 * @function displaySelectedChoices
 * @param {Array<string>} selectedChoices - Liste des ingrédients actuellement sélectionnés.
 * @param {HTMLElement} choiceContainer - Le conteneur HTML où afficher les pills.
 *
 * @example
 * displaySelectedChoices(["Menthe", "Citron"], document.getElementById("pills-container"));
 */
function displaySelectedChoices(selectedChoices, choiceContainer) {
    clear(choiceContainer)
    selectedChoices.forEach((ingredient, index) => {
        const onRemove = () => {
            selectedChoices.splice(index, 1);
            displaySelectedChoices(selectedChoices, choiceContainer);
        };
        const pill = createIngredientPill(ingredient, onRemove);
        choiceContainer.appendChild(pill);
    });
}

/**
 * Traite la saisie utilisateur d'un ingrédient :
 * - Ajoute l'ingrédient à la liste s'il n'est pas déjà présent,
 * - Met à jour l'affichage des ingrédients sélectionnés.
 *
 * @function processIngredientInput
 * @param {HTMLInputElement} input - Le champ de saisie de l'ingrédient.
 * @param {Array<string>} selectedChoices - La liste actuelle des ingrédients sélectionnés.
 * @param {HTMLElement} choiceContainer - Le conteneur HTML où afficher les ingrédients sous forme de pills.
 *
 * @example
 * processIngredientInput(document.getElementById("ingredient-input"), selectedChoices, document.getElementById("pills-container"));
 */
function processIngredientInput(input, selectedChoices, choiceContainer) {
    const ingredient = input.value.trim();
    if (ingredient && !selectedChoices.includes(ingredient)) {
        selectedChoices.push(capitalize(ingredient));
        displaySelectedChoices(selectedChoices, choiceContainer);
    }
}

/**
 * Ajoute un ingrédient saisi à la liste des ingrédients sélectionnés,
 * vide le champ de saisie et nettoie les suggestions affichées.
 *
 * @function addIngredient
 * @exports
 * @param {Array<string>} selectedChoices - La liste actuelle des ingrédients sélectionnés.
 * @param {HTMLElement} choiceContainer - Le conteneur HTML où afficher les ingrédients sous forme de pills.
 * @param {HTMLInputElement} input - Le champ de saisie de l'ingrédient.
 * @param {HTMLElement} suggestionsContainer - Le conteneur des suggestions à nettoyer après ajout.
 *
 * @example
 * addIngredient(selectedChoices, document.getElementById("pills-container"), inputElement, suggestionsDiv);
 */
export function addIngredient(selectedChoices, choiceContainer,input, suggestionsContainer){
    processIngredientInput(input, selectedChoices, choiceContainer)
    input.value = '';
    clear(suggestionsContainer)
}


// ---------------------------------------------
// Fonctions pour la gestion des suggestions
// ---------------------------------------------

/**
 * Crée un élément visuel représentant une suggestion d'ingrédient.
 * 
 * L'élément est cliquable et déclenche une action lorsque l'utilisateur le sélectionne.
 *
 * @function createSuggestionItem
 * @param {string} ingredient - Le nom de l'ingrédient à afficher comme suggestion.
 * @param {Function} onSelect - La fonction à exécuter lorsque l'utilisateur clique sur la suggestion.
 * @returns {HTMLDivElement} L'élément div représentant la suggestion.
 *
 * @example
 * const suggestion = createSuggestionItem("Menthe", (selected) => console.log(selected));
 * document.getElementById("suggestions-container").appendChild(suggestion);
 */
function createSuggestionItem(ingredient, onSelect) {
    const div = document.createElement("div");
    div.textContent = ingredient;
    div.classList.add("suggestion-item");
    div.addEventListener("click", () => onSelect(ingredient));
    return div;
}

/**
 * Filtre les suggestions d'ingrédients disponibles en fonction de la saisie utilisateur
 * et des ingrédients déjà sélectionnés.
 *
 * @function filterSuggestions
 * @param {Array<string>} allIngredients - La liste complète des ingrédients disponibles.
 * @param {Array<string>} selectedChoices - Les ingrédients déjà sélectionnés (à exclure des suggestions).
 * @param {string} inputValue - La valeur actuelle saisie par l'utilisateur dans le champ de recherche.
 * @returns {Array<string>} La liste des suggestions filtrées à afficher.
 *
 * @example
 * const suggestions = filterSuggestions(["Menthe", "Citron", "Thym"], ["Menthe"], "C");
 * console.log(suggestions); // ["Citron"]
 */
function filterSuggestions(allIngredients, selectedChoices, inputValue) {
    if (!inputValue) {return allIngredients.filter(ing => !selectedChoices.includes(ing));}
    return allIngredients.filter(ing => ing.startsWith(capitalize(inputValue)) && !selectedChoices.includes(ing));
}

/**
 * Affiche dynamiquement une liste de suggestions d'ingrédients basées sur la saisie utilisateur.
 * 
 * Les suggestions filtrées sont affichées dans le conteneur fourni et peuvent être sélectionnées.
 *
 * @function showSuggestions
 * @exports
 * @param {Array<string>} allIngredients - La liste complète des ingrédients disponibles.
 * @param {HTMLInputElement} input - Le champ de saisie où l'utilisateur tape.
 * @param {Array<string>} selectedChoices - Les ingrédients déjà sélectionnés (exclus des suggestions).
 * @param {HTMLElement} suggestionsContainer - L'élément HTML où afficher les suggestions.
 *
 * @example
 * showSuggestions(["Menthe", "Citron", "Thym"], inputElement, ["Menthe"], suggestionsDiv);
 */
export function showSuggestions(allIngredients, input, selectedChoices, suggestionsContainer) {
    const inputValue = input.value.trim()
    clear(suggestionsContainer);
    const filtered = filterSuggestions(allIngredients, selectedChoices, inputValue);
    filtered.forEach(ingredient => {
        const item = createSuggestionItem(ingredient, selectedValue => {
            input.value = selectedValue;
            clear(suggestionsContainer)
        });
        suggestionsContainer.appendChild(item);
    });
}


// ---------------------------------------------
// Fonctions de création de choix unique ou multiple
// ---------------------------------------------

/**
 * Crée un champ de sélection unique (soit un input texte si aucune option disponible,
 * soit un select avec un champ "Autre" en option).
 *
 * @function one_choice
 * @exports
 * @param {Array<string>} options - Liste des options disponibles.
 * @param {HTMLElement} container - L'élément HTML dans lequel insérer les champs créés.
 * @param {string} placeholder - Texte d'indication (placeholder) pour l'input ou l'option par défaut.
 * @param {string} inputId - ID à attribuer au champ principal (input ou select).
 * @param {boolean} required - Détermine si le champ est requis pour la validation du formulaire.
 *
 * @example
 * one_choice(["Thé Vert", "Thé Noir"], document.getElementById("types-container"), "Sélectionnez un type", "types", true);
 */
export function one_choice(options, container, placeholder, inputId, required) {
    if (options.length === 0) {
        const input = createInputElement("input", inputId, placeholder, "text", null);
        container.appendChild(input);
        input.required = required
    } else {
        const select = createSelectWithOptions([...options, 'autre'], placeholder, inputId);
        container.appendChild(select);
        select.required = required
        const otherInput = createInputElement("input", inputId, placeholder, "text", null);
        Object.assign(otherInput, {display: "none"})
        container.appendChild(otherInput);
        bindOtherToggle(select, otherInput);
    }
}

/**
 * Crée un champ de sélection multiple d'ingrédients avec :
 * - Un champ de saisie,
 * - Un bouton pour ajouter l'ingrédient,
 * - Une liste de suggestions dynamiques,
 * - Une zone affichant les ingrédients sélectionnés sous forme de pills.
 *
 * @function multiplechoice
 * @exports
 * @param {Array<string>} options - Liste complète des options disponibles (ingrédients).
 * @param {HTMLElement} container - Le conteneur HTML où insérer le champ complet.
 * @param {string} inputPlaceholder - Texte d'indication affiché dans le champ de saisie.
 * @param {string} inputId - ID à attribuer au champ de saisie.
 * @param {boolean} required - Indique si au moins un ingrédient doit être sélectionné (validation formulaire).
 *
 * @example
 * multiplechoice(["Menthe", "Citron"], document.getElementById("ingredients-container"), "Entrez un ingrédient", "ingredients", true);
 */
export function multiplechoice(options, container, inputPlaceholder, inputId, required) {
    const selectedChoices = [];
    const { suggestionsContainer, choiceContainer } = makeMultiChoiceContainers();
    const { input, button } = makeMultiChoiceControls(inputId, inputPlaceholder);
    setupInputHandlers(options, input, selectedChoices, suggestionsContainer)
    setupKeyboardNavigation(input, suggestionsContainer);
    setupAddButton(button, selectedChoices, choiceContainer, input, suggestionsContainer)
    container.appendChild(input);
    container.appendChild(button);
    container.appendChild(suggestionsContainer);
    container.appendChild(choiceContainer);
}


// ---------------------------------------------
// Fonction finale pour créer un champ basé sur localStorage
// ---------------------------------------------

/**
 * Crée un champ de formulaire basé sur des options récupérées depuis le localStorage,
 * et utilise un callback pour construire dynamiquement le champ (select ou autre).
 *
 * @function createInputWithOptions
 * @exports
 * @param {string} storageKey - La clé dans le localStorage pour récupérer les options disponibles.
 * @param {string} labelText - Le texte du label associé au champ.
 * @param {string} inputId - L'ID à attribuer au champ de saisie.
 * @param {string} inputPlaceholder - Le texte d'indication pour le champ.
 * @param {Function} callback - La fonction de création du champ (ex: `one_choice` ou `multiplechoice`).
 * @param {boolean} required - Indique si le champ est requis pour le formulaire.
 * @returns {HTMLDivElement} Le conteneur div contenant le label et le champ généré.
 *
 * @example
 * createInputWithOptions("typesAvailable", "Type :", "types", "Entrez un type", one_choice, true);
 */
export function createInputWithOptions(storageKey, labelText, inputId, inputPlaceholder, callback, required) {
    const wrapper = makeLabeledWrapper(inputId, labelText);
    const options = getDataFromLocalStorage(storageKey);
    callback(options, wrapper, inputPlaceholder, inputId, required);
    return wrapper;
}
