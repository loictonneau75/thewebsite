/**
 * Identifiants des champs du formulaire.
 * 
 * Cet objet centralise les IDs utilisés pour cibler
 * les différents éléments du formulaire de création de thé.
 *
 * @constant {Object} FIELD_IDS
 * @exports
 * @property {string} name - ID du champ pour le nom du thé.
 * @property {string} types - ID du champ pour le type de thé.
 * @property {string} brands - ID du champ pour la marque du thé.
 * @property {string} ingredients - ID du conteneur des ingrédients sélectionnés.
 * @property {string} comments - ID du champ pour le commentaire sur le thé.
 */
export const FIELD_IDS = {
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
 * @exports
 * @property {string} typesAvailable - Clé pour les types de thés disponibles.
 * @property {string} brandsAvailable - Clé pour les marques de thés disponibles.
 * @property {string} ingredientsAvailable - Clé pour les ingrédients disponibles.
 */
export const LOCAL_STORAGE_KEYS = {
    typesAvailable: "typesAvailable",
    brandsAvailable: "brandsAvailable",
    ingredientsAvailable: "ingredientsAvailable"
};

/**
 * Met en majuscule la première lettre d'une chaîne de caractères.
 *
 * @function capitalize
 * @exports
 * @param {string} s - La chaîne de caractères à modifier.
 * @returns {string} La chaîne avec sa première lettre en majuscule.
 *
 * @example
 * capitalize("thé"); // retourne "Thé"
 */
export function capitalize(s){
    return String(s[0]).toUpperCase() + String(s).slice(1);
}

/**
 * Vide tout le contenu HTML d'un élément donné.
 *
 * @function clear
 * @exports
 * @param {HTMLElement} container - L'élément HTML dont on souhaite effacer le contenu.
 *
 * @example
 * const div = document.getElementById("id");
 * clear(div); // vide complètement le contenu de la div
 */
export function clear(container){
    container.innerHTML = ""
}