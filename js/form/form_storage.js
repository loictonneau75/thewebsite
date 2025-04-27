import { LOCAL_STORAGE_KEYS } from "./form_constants.js";


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
 * @export
 * @param {string} storageKey - La clé associée dans le localStorage.
 * @returns {Array} Le tableau récupéré depuis le localStorage, ou un tableau vide si la clé est absente ou invalide.
 *
 * @example
 * const types = getDataFromLocalStorage("typesAvailable");
 * console.log(types); // ["Thé Vert", "Thé Noir", ...]
 */
export function getDataFromLocalStorage(storageKey) {
    const rawData = localStorage.getItem(storageKey);
    return safeParseArray(rawData)
}

/**
 * Sauvegarde un nouvel objet thé dans le localStorage sous la clé "teas".
 * 
 * Si des thés existent déjà, le nouveau thé est ajouté à la liste existante.
 *
 * @function saveTeaToLocalStorage
 * @export
 * @param {Object} tea - L'objet représentant un thé à sauvegarder.
 *
 * @example
 * const tea = { name: "Thé Vert", type: "Thé Vert", brand: "Marque X", ingredients: ["Menthe"], comment: "Très bon" };
 * saveTeaToLocalStorage(tea);
 */
export function saveTeaToLocalStorage(tea) {
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
 * @exports
 * @param {Object} tea - L'objet thé contenant les informations à enregistrer.
 * @param {string} tea.brand - La marque du thé à ajouter.
 * @param {string} tea.type - Le type du thé à ajouter.
 * @param {Array<string>} tea.ingredients - Les ingrédients du thé à ajouter.
 *
 * @example
 * const tea = { name: "Thé Vert", type: "Thé Vert", brand: "Lipton", ingredients: ["Menthe"], comment: "" };
 * updateAvailableChoices(tea);
 */
export function updateAvailableChoices(tea) {
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