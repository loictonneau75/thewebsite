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

function clear(container){
    container.innerHTML = ""
}

function createInputElement(tag , id, placeholder, inputType, rows, style) {
    const element = document.createElement(tag);
    element.id = id;
    if (tag === "textarea") {
      element.rows = rows;
    } else {
      element.type = inputType;
      element.placeholder = placeholder;
    }
    Object.assign(element.style, style);
    return element;
}

function makeLabel(forId, text) {
    const label = document.createElement("label");
    label.htmlFor = forId;
    label.innerText = text;
    return label;
}

// todo changer type en tag
function createInputField(fieldType, fieldId, labelText, rows, required) {
    const wrapper = document.createElement("div");
    const label   = makeLabel(fieldId, labelText);
    const input = createInputElement(fieldType, fieldId, "", "text", rows, {} );
    input.required = required
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return wrapper;
}

function safeParseArray(jsonString) {
    try {
        return jsonString ? JSON.parse(jsonString) : [];
    } catch (e) {
        console.error("Erreur de parsing JSON :", e);
        return [];
    }
  }

function getDataFromLocalStorage(storageKey) {
    const rawData = localStorage.getItem(storageKey);
    return safeParseArray(rawData)
}

function makeSelect(id) {
    const select = document.createElement('select');
    if (id) select.id = id;
    return select;
}

function makeOption({ value, text, disabled = false, selected = false }) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    if (disabled) option.disabled = true;
    if (selected) option.selected = true;
    return option;
}

function createSelectWithOptions(options, placeholder) {
    const select = makeSelect('type-select');
    const defaultOpt = makeOption({value:'', text:placeholder, disabled: true, selected: true});
    select.appendChild(defaultOpt);
    options.forEach(value => {select.appendChild(makeOption({ value: value, text: value }))});
    return select;
}

function bindOtherToggle(select, otherInput) {
    select.addEventListener('change', () => {
        otherInput.style.display = (select.value === 'autre') ? 'block' : 'none';
    });
}

function one_choice(options, container, placeholder, inputId, required) {
    if (options.length === 0) {
        const input = createInputElement("input", inputId, placeholder, "text", null, {});
        container.appendChild(input);
        input.required = required
    } else {
        const select = createSelectWithOptions([...options, 'autre'], placeholder);
        container.appendChild(select);
        select.required = required
        const otherInput = createInputElement("input", inputId, placeholder, "text", null, { display: 'none' });        
        container.appendChild(otherInput);
        bindOtherToggle(select, otherInput);
    }
}

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

function processIngredientInput(input, selectedChoices, choiceContainer) {
    const ingredient = input.value.trim();
    if (ingredient && !selectedChoices.includes(ingredient)) {
        selectedChoices.push(capitalize(ingredient));
        displaySelectedChoices(selectedChoices, choiceContainer);
    }
}

function addIngredient(selectedChoices, choiceContainer,input, suggestionsContainer){
    processIngredientInput(input, selectedChoices, choiceContainer)
    input.value = '';
    clear(suggestionsContainer)
    
}

function filterSuggestions(allIngredients, selectedChoices, inputValue) {
    if (!inputValue) {
        return allIngredients.filter(ing => !selectedChoices.includes(ing));
    }
    return allIngredients.filter(ing => ing.startsWith(capitalize(inputValue)) && !selectedChoices.includes(ing));
}

function createSuggestionItem(ingredient, onSelect) {
    const div = document.createElement("div");
    div.textContent = ingredient;
    div.classList.add("suggestion-item");
    div.addEventListener("click", () => onSelect(ingredient));
    return div;
}

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

function makeMultiChoiceContainers() {
    const suggestionsContainer = document.createElement("div");
    suggestionsContainer.classList.add("suggestions-container");
    const choiceContainer = document.createElement("div");
    choiceContainer.id = "pills-container";
    return { suggestionsContainer, choiceContainer };
}

function makeMultiChoiceControls(inputId, placeholder) {
    const input = createInputElement("input", inputId, placeholder, "text", null, {});
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Ajouter";
    return {input, button};
}

//todo 
function multiplechoice(options, container, inputPlaceholder, inputId, required) {
    const selectedChoices = [];
    const { suggestionsContainer, choiceContainer } = makeMultiChoiceContainers();
    const { input, button } = makeMultiChoiceControls(inputId, inputPlaceholder);
    
  
    let currentIndex = -1; 
  
    // 1) Afficher les suggestions à la frappe
    input.addEventListener("input", () => {
      currentIndex = -1;
      showSuggestions(options, input, selectedChoices, suggestionsContainer);
    });
  
    // 2) Navigation avec ↑, ↓ et Entrée
    input.addEventListener("keydown", e => {
        const items = suggestionsContainer.querySelectorAll(".suggestion-item");
        if (!items.length) return;
  
        if (e.key === "ArrowDown") {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % items.length;
            items.forEach((it, i) => it.classList.toggle("highlight", i === currentIndex));
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            items.forEach((it, i) => it.classList.toggle("highlight", i === currentIndex));
        }
        else if (e.key === "Enter") {
            e.preventDefault();
            if (currentIndex >= 0) {
                input.value = items[currentIndex].textContent;
                clear(suggestionsContainer);
                currentIndex = -1;
            }
        }
    });
  
    // 3) Ajout par clic
    button.addEventListener("click", () =>
        addIngredient(selectedChoices, choiceContainer, input, suggestionsContainer)
    );
  
    // 4) Montage
    container.appendChild(input);
    container.appendChild(button);
    container.appendChild(suggestionsContainer);
    container.appendChild(choiceContainer);
}

function makeLabeledWrapper(forId, labelText) {
    const wrapper = document.createElement("div");
    const label = document.createElement("label");
    label.htmlFor = forId;
    label.innerText = labelText;
    wrapper.appendChild(label);
    return wrapper;
}

function createInputWithOptions(storageKey, labelText, inputId, inputPlaceholder, callback, required) {
    const wrapper = makeLabeledWrapper(inputId, labelText);
    const options = getDataFromLocalStorage(storageKey);
    callback(options, wrapper, inputPlaceholder, inputId, required);
    return wrapper;
}

function createSubmitBtn(){
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Envoyer";
    return submitBtn
}

export function attachFormHandler() {
    const form = document.getElementById("formulaire-the");
    form.addEventListener("submit", e => {
        e.preventDefault();
    });
}

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

