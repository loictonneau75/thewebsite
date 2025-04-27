export function create_modal(){
    const modal_container = document.createElement("div");
    modal_container.id = "modale-suppression";
    modal_container.classList.add("modal");
    
    const modal = document.createElement("div")
    modal.classList.add("modale-contenu")
    modal_container.appendChild(modal)
    
    const confirm_suppression_text = document.createElement("p")
    confirm_suppression_text.innerText = "Voulez-vous vraiment supprimer ce thé ?"
    modal.appendChild(confirm_suppression_text)
    
    const action_container = document.createElement("div")
    action_container.classList.add("modale_action")
    modal.appendChild(action_container)

    const confirm_suppression_button = document.createElement("button")
    confirm_suppression_button.id = "confirm_suppression"
    confirm_suppression_button.innerText = "Oui"
    action_container.appendChild(confirm_suppression_button)
    
    const undo_suppression_button = document.createElement("button")
    undo_suppression_button.id = "undo_suppression"
    undo_suppression_button.innerText = "Annuler"
    action_container.appendChild(undo_suppression_button)

    return modal_container
}
