/**
 * Identifiants des champs du formulaire.
 * 
 * Cet objet centralise les IDs utilisés pour cibler
 * les différents éléments du formulaire de création de thé.
 *
 * @constant {Object} FIELD_IDS
 * @property {string} name - ID du champ pour le nom du thé.
 * @property {string} types - ID du champ pour le type de thé.
 * @property {string} brands - ID du champ pour la marque du thé.
 * @property {string} ingredients - ID du conteneur des ingrédients sélectionnés.
 * @property {string} comments - ID du champ pour le commentaire sur le thé.
 */
const FIELD_IDS = {
    name: "name",
    types: "types",
    brands: "brands",
    ingredients: "ingredients_container",
    comments: "comments_container"
};

/**
 * Clés utilisées pour accéder aux données dans le localStorage.
 * 
 * Cet objet centralise les noms des clés servant à stocker
 * les types, marques et ingrédients disponibles.
 *
 * @constant {Object} LOCAL_STORAGE_KEYS
 * @property {string} typesAvailable - Clé pour les types de thés disponibles.
 * @property {string} brandsAvailable - Clé pour les marques de thés disponibles.
 * @property {string} ingredientsAvailable - Clé pour les ingrédients disponibles.
 */
const LOCAL_STORAGE_KEYS = {
    typesAvailable: "typesAvailable",
    brandsAvailable: "brandsAvailable",
    ingredientsAvailable: "ingredientsAvailable"
};

/**
 * Met en majuscule la première lettre d'une chaîne de caractères.
 *
 * @function capitalize
 * @param {string} s - La chaîne de caractères à modifier.
 * @returns {string} La chaîne avec sa première lettre en majuscule.
 *
 * @example
 * capitalize("thé"); // retourne "Thé"
 */
function capitalize(s){
    return String(s[0]).toUpperCase() + String(s).slice(1);
}

/**
 * Vide tout le contenu HTML d'un élément donné.
 *
 * @function clear
 * @param {HTMLElement} container - L'élément HTML dont on souhaite effacer le contenu.
 *
 * @example
 * const div = document.getElementById("id");
 * clear(div); // vide complètement le contenu de la div
 */
function clear(container){
    container.innerHTML = ""
}

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
function createInputElement(tag , id, placeholder, inputType, rows, style) {
    const element = document.createElement(tag);
    element.id = id;
    if (tag === "textarea") {
        element.rows = rows;
    }else{
        element.type = inputType;
        element.placeholder = placeholder;
    }
    Object.assign(element.style, style);
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
 * Crée un champ de formulaire complet avec un label et un input (ou textarea).
 *
 * @function createInputField
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
function createInputField(fieldTag, fieldId, labelText, rows, required) {
    const wrapper = document.createElement("div");
    const label = makeLabel(fieldId, labelText);
    const input = createInputElement(fieldTag, fieldId, "", "text", rows, {} );
    input.required = required
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return wrapper;
}

/**
 * Tente de parser une chaîne JSON en tableau en toute sécurité.
 * 
 * Si la chaîne est invalide ou vide, retourne un tableau vide
 * et affiche une erreur dans la console en cas d'échec du parsing.
 *
 * @function safeParseArray
 * @param {string|null} jsonString - La chaîne JSON à parser.
 * @returns {Array} Le tableau parsé, ou un tableau vide en cas d'erreur ou si la chaîne est nulle.
 *
 * @example
 * safeParseArray('["thé", "infusion"]'); // retourne ["thé", "infusion"]
 * safeParseArray(null); // retourne []
 * safeParseArray('invalide'); // retourne [] et affiche une erreur dans la console
 */
function safeParseArray(jsonString) {
    try {
        return jsonString ? JSON.parse(jsonString) : [];
    } catch (e) {
        console.error("Erreur de parsing JSON :", e);
        return [];
    }
}

/**
 * Récupère et parse en toute sécurité un tableau stocké dans le localStorage.
 *
 * @function getDataFromLocalStorage
 * @param {string} storageKey - La clé associée dans le localStorage.
 * @returns {Array} Le tableau récupéré depuis le localStorage, ou un tableau vide si la clé est absente ou invalide.
 *
 * @example
 * const types = getDataFromLocalStorage("typesAvailable");
 * console.log(types); // ["Thé Vert", "Thé Noir", ...]
 */
function getDataFromLocalStorage(storageKey) {
    const rawData = localStorage.getItem(storageKey);
    return safeParseArray(rawData)
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
 * Active ou désactive dynamiquement l'affichage et la validation d'un champ "Autre" 
 * en fonction de la sélection d'une option spécifique dans un `<select>`.
 *
 * @function bindOtherToggle
 * @param {HTMLSelectElement} select - L'élément select à surveiller.
 * @param {HTMLInputElement} otherInput - Le champ input à afficher ou cacher si "autre" est sélectionné.
 *
 * @example
 * bindOtherToggle(document.getElementById("types-select"), document.getElementById("types"));
 */
function bindOtherToggle(select, otherInput) {
    select.addEventListener('change', () => {
        const isOtherSelected = select.value === 'autre';
        otherInput.style.display = isOtherSelected ? 'block' : 'none';
        otherInput.required = isOtherSelected;
    });
}

/**
 * Crée un champ de sélection unique (soit un input texte si aucune option disponible,
 * soit un select avec un champ "Autre" en option).
 *
 * @function one_choice
 * @param {Array<string>} options - Liste des options disponibles.
 * @param {HTMLElement} container - L'élément HTML dans lequel insérer les champs créés.
 * @param {string} placeholder - Texte d'indication (placeholder) pour l'input ou l'option par défaut.
 * @param {string} inputId - ID à attribuer au champ principal (input ou select).
 * @param {boolean} required - Détermine si le champ est requis pour la validation du formulaire.
 *
 * @example
 * one_choice(["Thé Vert", "Thé Noir"], document.getElementById("types-container"), "Sélectionnez un type", "types", true);
 */
function one_choice(options, container, placeholder, inputId, required) {
    if (options.length === 0) {
        const input = createInputElement("input", inputId, placeholder, "text", null, {});
        container.appendChild(input);
        input.required = required
    } else {
        const select = createSelectWithOptions([...options, 'autre'], placeholder, inputId);
        container.appendChild(select);
        select.required = required
        const otherInput = createInputElement("input", inputId, placeholder, "text", null, { display: 'none' });        
        container.appendChild(otherInput);
        bindOtherToggle(select, otherInput);
    }
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
 * @param {Array<string>} selectedChoices - La liste actuelle des ingrédients sélectionnés.
 * @param {HTMLElement} choiceContainer - Le conteneur HTML où afficher les ingrédients sous forme de pills.
 * @param {HTMLInputElement} input - Le champ de saisie de l'ingrédient.
 * @param {HTMLElement} suggestionsContainer - Le conteneur des suggestions à nettoyer après ajout.
 *
 * @example
 * addIngredient(selectedChoices, document.getElementById("pills-container"), inputElement, suggestionsDiv);
 */
function addIngredient(selectedChoices, choiceContainer,input, suggestionsContainer){
    processIngredientInput(input, selectedChoices, choiceContainer)
    input.value = '';
    clear(suggestionsContainer)
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
 * Affiche dynamiquement une liste de suggestions d'ingrédients basées sur la saisie utilisateur.
 * 
 * Les suggestions filtrées sont affichées dans le conteneur fourni et peuvent être sélectionnées.
 *
 * @function showSuggestions
 * @param {Array<string>} allIngredients - La liste complète des ingrédients disponibles.
 * @param {HTMLInputElement} input - Le champ de saisie où l'utilisateur tape.
 * @param {Array<string>} selectedChoices - Les ingrédients déjà sélectionnés (exclus des suggestions).
 * @param {HTMLElement} suggestionsContainer - L'élément HTML où afficher les suggestions.
 *
 * @example
 * showSuggestions(["Menthe", "Citron", "Thym"], inputElement, ["Menthe"], suggestionsDiv);
 */
function showSuggestions(allIngredients, input, selectedChoices, suggestionsContainer) {
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
    const input = createInputElement("input", inputId, placeholder, "text", null, {});
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Ajouter";
    return {input, button};
}

/**
 * Configure l'événement d'entrée (input) pour afficher dynamiquement
 * des suggestions d'ingrédients en fonction de la saisie utilisateur.
 *
 * @function setupInputHandlers
 * @param {Array<string>} options - Liste complète des ingrédients disponibles.
 * @param {HTMLInputElement} input - Le champ de saisie sur lequel écouter l'événement "input".
 * @param {Array<string>} selectedChoices - Liste actuelle des ingrédients sélectionnés (à exclure des suggestions).
 * @param {HTMLElement} suggestionsContainer - Le conteneur HTML où afficher les suggestions filtrées.
 *
 * @example
 * setupInputHandlers(["Menthe", "Citron"], inputElement, selectedChoices, suggestionsContainer);
 */
function setupInputHandlers(options, input, selectedChoices, suggestionsContainer){
    input.addEventListener("input", () => {
        showSuggestions(options, input, selectedChoices, suggestionsContainer);
      });
}

/**
 * Configure la navigation au clavier pour parcourir et sélectionner
 * les suggestions avec les touches fléchées (↑, ↓) et Entrée.
 *
 * @function setupKeyboardNavigation
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
function setupKeyboardNavigation(input, suggestionsContainer){
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
 * @param {HTMLButtonElement} button - Le bouton sur lequel écouter l'événement "click".
 * @param {Array<string>} selectedChoices - Liste actuelle des ingrédients sélectionnés.
 * @param {HTMLElement} choiceContainer - Conteneur HTML où afficher les ingrédients sous forme de pills.
 * @param {HTMLInputElement} input - Le champ de saisie de l'ingrédient.
 * @param {HTMLElement} suggestionsContainer - Conteneur des suggestions à vider après ajout.
 *
 * @example
 * setupAddButton(addButton, selectedChoices, pillsContainer, inputElement, suggestionsContainer);
 */
function setupAddButton(button, selectedChoices, choiceContainer, input, suggestionsContainer){
    button.addEventListener("click", () =>
        addIngredient(selectedChoices, choiceContainer, input, suggestionsContainer)
    );
}

/**
 * Crée un champ de sélection multiple d'ingrédients avec :
 * - Un champ de saisie,
 * - Un bouton pour ajouter l'ingrédient,
 * - Une liste de suggestions dynamiques,
 * - Une zone affichant les ingrédients sélectionnés sous forme de pills.
 *
 * @function multiplechoice
 * @param {Array<string>} options - Liste complète des options disponibles (ingrédients).
 * @param {HTMLElement} container - Le conteneur HTML où insérer le champ complet.
 * @param {string} inputPlaceholder - Texte d'indication affiché dans le champ de saisie.
 * @param {string} inputId - ID à attribuer au champ de saisie.
 * @param {boolean} required - Indique si au moins un ingrédient doit être sélectionné (validation formulaire).
 *
 * @example
 * multiplechoice(["Menthe", "Citron"], document.getElementById("ingredients-container"), "Entrez un ingrédient", "ingredients", true);
 */
function multiplechoice(options, container, inputPlaceholder, inputId, required) {
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
 * Crée un champ de formulaire basé sur des options récupérées depuis le localStorage,
 * et utilise un callback pour construire dynamiquement le champ (select ou autre).
 *
 * @function createInputWithOptions
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
function createInputWithOptions(storageKey, labelText, inputId, inputPlaceholder, callback, required) {
    const wrapper = makeLabeledWrapper(inputId, labelText);
    const options = getDataFromLocalStorage(storageKey);
    callback(options, wrapper, inputPlaceholder, inputId, required);
    return wrapper;
}

/**
 * Crée un bouton de soumission pour un formulaire.
 *
 * @function createSubmitBtn
 * @returns {HTMLButtonElement} Le bouton de type "submit" avec le texte "Envoyer".
 *
 * @example
 * const submitButton = createSubmitBtn();
 * document.getElementById("formulaire-the").appendChild(submitButton);
 */
function createSubmitBtn(){
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Envoyer";
    return submitBtn
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
 * Sauvegarde un nouvel objet thé dans le localStorage sous la clé "teas".
 * 
 * Si des thés existent déjà, le nouveau thé est ajouté à la liste existante.
 *
 * @function saveTeaToLocalStorage
 * @param {Object} tea - L'objet représentant un thé à sauvegarder.
 *
 * @example
 * const tea = { name: "Thé Vert", type: "Thé Vert", brand: "Marque X", ingredients: ["Menthe"], comment: "Très bon" };
 * saveTeaToLocalStorage(tea);
 */
function saveTeaToLocalStorage(tea) {
    const teas = JSON.parse(localStorage.getItem("teas")) || [];
    teas.push(tea);
    localStorage.setItem("teas", JSON.stringify(teas));
}

/**
 * Sauvegarde une valeur unique dans une liste stockée dans le localStorage sous une clé donnée.
 * 
 * Si la valeur existe déjà, elle n'est pas ajoutée pour éviter les doublons.
 *
 * @function saveChoiceToLocalStorage
 * @param {string} key - La clé du localStorage où stocker la liste.
 * @param {string} value - La valeur à ajouter dans la liste.
 *
 * @example
 * saveChoiceToLocalStorage("brandsAvailable", "Lipton");
 */
function saveChoiceToLocalStorage(key, value) {
    const storedValues = JSON.parse(localStorage.getItem(key)) || [];
    if (!storedValues.includes(value)) {
        storedValues.push(value);
        localStorage.setItem(key, JSON.stringify(storedValues));
    }
}

/**
 * Met à jour les listes disponibles dans le localStorage
 * (types, marques, ingrédients) à partir d'un nouvel objet thé.
 *
 * @function updateAvailableChoices
 * @param {Object} tea - L'objet thé contenant les informations à enregistrer.
 * @param {string} tea.brand - La marque du thé à ajouter.
 * @param {string} tea.type - Le type du thé à ajouter.
 * @param {Array<string>} tea.ingredients - Les ingrédients du thé à ajouter.
 *
 * @example
 * const tea = { name: "Thé Vert", type: "Thé Vert", brand: "Lipton", ingredients: ["Menthe"], comment: "" };
 * updateAvailableChoices(tea);
 */
function updateAvailableChoices(tea) {
    if (tea.brand) {
        saveChoiceToLocalStorage(LOCAL_STORAGE_KEYS.brandsAvailable, tea.brand);
    }
    if (tea.type) {
        saveChoiceToLocalStorage(LOCAL_STORAGE_KEYS.typesAvailable, tea.type);
    }
    if (tea.ingredients.length > 0) {
        tea.ingredients.forEach(ingredient => {
            saveChoiceToLocalStorage(LOCAL_STORAGE_KEYS.ingredientsAvailable, ingredient);
        });
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
    form.appendChild(createInputField("input", FIELD_IDS.name, "Nom du Thé :",null, true));
    form.appendChild(createInputWithOptions(LOCAL_STORAGE_KEYS.typesAvailable, "Type :", FIELD_IDS.types, "Entrez un type", one_choice, true));
    form.appendChild(createInputWithOptions(LOCAL_STORAGE_KEYS.brandsAvailable, "Marque :", FIELD_IDS.brands, "Entrez une marque", one_choice, false));
    form.appendChild(createInputWithOptions(LOCAL_STORAGE_KEYS.ingredientsAvailable, "Ingredient :", FIELD_IDS.ingredients, "Entrez un ingredient", multiplechoice, true))
    form.appendChild(createInputField("textarea", FIELD_IDS.comments, "Ton commentaire :",2, true));
    form.appendChild(createSubmitBtn());
    return form;
}

