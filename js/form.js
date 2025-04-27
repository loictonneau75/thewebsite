const FIELD_IDS = {
    name: "name",
    types: "types",
    brands: "brands",
    ingredients: "ingredients_container",
    comments: "comments_container"
};

const LOCAL_STORAGE_KEYS = {
    typesAvailable: "typesAvailable",
    brandsAvailable: "brandsAvailable",
    ingredientsAvailable: "ingredientsAvailable"
};

function capitalize(s){
    return String(s[0]).toUpperCase() + String(s).slice(1);
}

function createInputField(fieldType, fieldId, labelText, rows = 2) {
    const div = document.createElement("div");
    const label = document.createElement("label");
    label.for = fieldId;
    label.innerText = labelText;
    const input = document.createElement(fieldType);
    input.id = fieldId;
    if (fieldType === "textarea") {
        input.rows = rows;
        input.required = true;
    } else {
        input.type = "text";
        input.placeholder = "";
    }
    div.appendChild(label);
    div.appendChild(input);
    return div;
}

function getDataFromLocalStorage(storageKey) {
    const rawData = localStorage.getItem(storageKey);
    let parsedData = [];
    try {
        parsedData = rawData ? JSON.parse(rawData) : [];
    } catch (error) {
        console.error("Erreur de parsing JSON:", error);
    }
    return parsedData;
}

function createInput(type, id, placeholder, style = {}) {
    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.placeholder = placeholder;
    Object.assign(input.style, style);
    return input;
}

function createSelectWithOptions(options, inputPlaceholder) {
    const select = document.createElement('select');
    select.id = 'type-select';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = inputPlaceholder;
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);
    options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        select.appendChild(option);
    });
    return select;
}

function one_choice(options, div, inputPlaceholder, inputId){
    if (options.length === 0) {
        const input = createInput("text", inputId, inputPlaceholder);
        div.appendChild(input);
    } else {
        const select = createSelectWithOptions([...options, 'autre'],inputPlaceholder);
        div.appendChild(select);
        const input = createInput("text", `${inputId}-input`, inputPlaceholder, { display: 'none' });
        div.appendChild(input);
        select.addEventListener('change', () => {
        input.style.display = (select.value === 'autre') ? 'block' : 'none';
    });
    }
}

function displaySelectedChoices(selectedChoices, choiceContainer) {
    choiceContainer.innerHTML = "";
    selectedChoices.forEach((ingredient, index) => {
        choiceContainer.classList.add('ingredient-pill');
        const ingredientText = document.createElement('span');
        ingredientText.textContent = ingredient;
        choiceContainer.appendChild(ingredientText);
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.classList.add("close-btn");
        closeBtn.addEventListener('click', () => {
            selectedChoices.splice(index, 1);
            choiceContainer.remove();
        });
        choiceContainer.appendChild(closeBtn);
    });
}

function addIngredient(selectedChoices, choiceContainer,input, suggestionsContainer){
    const ingredient = input.value.trim();
    if (ingredient && !selectedChoices.includes(ingredient)) {
        selectedChoices.push(capitalize(ingredient));
        displaySelectedChoices(selectedChoices, choiceContainer);
    }
    input.value = '';
    suggestionsContainer.innerHTML = ""
}

function showSuggestions(allIngredients, input, selectedChoices,suggestionsContainer) {
    const inputValue = input.value.trim();
    suggestionsContainer.innerHTML = ""
    let filteredSuggestions;
    if (inputValue === '') {
        filteredSuggestions = allIngredients.filter(ingredient => 
            !selectedChoices.includes(ingredient)
        );
    } else {            filteredSuggestions = allIngredients
            .filter(ingredient => 
                ingredient.startsWith(capitalize(inputValue)) && 
                !selectedChoices.includes(ingredient)
            );
    }        filteredSuggestions.forEach(ingredient => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.textContent = ingredient;
        suggestionDiv.addEventListener('click', () => {input.value = ingredient});
        suggestionsContainer.appendChild(suggestionDiv);
    });
}


function multiplechoice(options, div, inputPlaceholder, inputId) {
    const selectedChoices = [];
    const choiceContainer = document.createElement('div');
    const suggestionsContainer = document.createElement('div');
    const input = createInput("text", inputId, inputPlaceholder);
    const add_button = document.createElement("button");
    add_button.type = "button";
    add_button.textContent = "Ajouter";
    add_button.addEventListener('click', () => addIngredient(selectedChoices, choiceContainer ,input, suggestionsContainer));
    input.addEventListener('input', () => showSuggestions(options, input, selectedChoices, suggestionsContainer));
    div.appendChild(input);
    div.appendChild(add_button);
    div.appendChild(suggestionsContainer);
    div.appendChild(choiceContainer);
}


function createInputWithOptions(storageKey, labelText, inputId, inputPlaceholder, callback) {
    const div = document.createElement("div");
    const label = document.createElement("label");
    label.for = inputId;
    label.innerText = labelText;
    div.innerHTML = "";
    div.appendChild(label);
    const options = getDataFromLocalStorage(storageKey);
    callback(options, div, inputPlaceholder, inputId)
    return div;
}

export function create_form() {
    const form = document.createElement("form");
    form.id = "formulaire-the";
    form.appendChild(createInputField("input", FIELD_IDS.name, "Nom du Thé :"));
    form.appendChild(createInputWithOptions(LOCAL_STORAGE_KEYS.typesAvailable, "Type :", FIELD_IDS.types, "Entrez un type", one_choice));
    form.appendChild(createInputWithOptions(LOCAL_STORAGE_KEYS.brandsAvailable, "Marque :", FIELD_IDS.brands, "Entrez une marque", one_choice));
    form.appendChild(createInputWithOptions(LOCAL_STORAGE_KEYS.ingredientsAvailable, "Ingredient :", FIELD_IDS.ingredients, "Entrez un ingredient", multiplechoice))
    form.appendChild(createInputField("textarea", FIELD_IDS.comments, "Ton commentaire :"));
    return form;
}
