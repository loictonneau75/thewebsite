export function getDataFromLocalStorage(storageKey){
    const rawData = localStorage.getItem(storageKey)
    try {return rawData ? JSON.parse(rawData) : []}
    catch(e) {console.error("Erreur de parsing JSON: ", e)}
};