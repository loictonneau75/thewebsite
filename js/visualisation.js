import { clear } from "./form/form_constants.js";

export function displayTeas() {
    const teaView = document.createElement("div");
    const h2 = document.createElement("h2");
    h2.innerText = "Liste de mes thés";

    const teas = JSON.parse(localStorage.getItem("teas")) || [];

    clear(teaView);
    teaView.appendChild(h2);

    if (teas.length === 0) {
        const p = document.createElement("p");
        p.innerText = "Aucun thé enregistré.";
        teaView.appendChild(p);
    } else {
        teas.forEach((tea, index) => {
            const card = document.createElement("div");
            card.classList.add("tea-card");

            const name = document.createElement("h3");
            name.innerText = tea.name;
            card.appendChild(name);

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

            card.appendChild(type);
            card.appendChild(brand);
            card.appendChild(ingredients);
            card.appendChild(comment);
            card.appendChild(deleteBtn);

            teaView.appendChild(card);
        });
    }

    return teaView;
}

function deleteTea(index) {
    let teas = JSON.parse(localStorage.getItem("teas")) || [];

    if (index >= 0 && index < teas.length) {
        const teaToRemove = teas[index];

        // Retirer le thé du tableau
        teas.splice(index, 1);
        localStorage.setItem("teas", JSON.stringify(teas));

        // Mise à jour des types, marques, ingrédients
        updateAvailableLists(teas, teaToRemove);

        // Recharger la page pour tout mettre à jour
        location.reload();
    }
}


function updateAvailableLists(teas, removedTea) {
    updateList(teas, removedTea.type, "typesAvailable", tea => tea.type);
    updateList(teas, removedTea.brand, "brandsAvailable", tea => tea.brand);

    removedTea.ingredients.forEach(ingredient => {
        updateList(teas, ingredient, "ingredientsAvailable", tea => tea.ingredients);
    });
}

function updateList(teas, value, storageKey, extractor) {
    const allValues = teas.map(extractor).flat();
    if (!allValues.includes(value)) {
        // Retirer la valeur
        const stored = JSON.parse(localStorage.getItem(storageKey)) || [];
        const updated = stored.filter(item => item !== value);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    }
}
