import { create_form } from "./form.js";
import { attachFormHandler } from "./form.js";
import { create_modal } from "./confirm_modal.js";

function setup_doc(name) {
    document.title = name;
    const h1 = document.createElement('h1');
    h1.innerText = name;
    document.body.appendChild(h1);
    document.body.appendChild(create_form())
    attachFormHandler()
    
    const h2 = document.createElement("h2")
    h2.innerText = "Liste de mes thés"
    const théView = document.createElement("div")
    théView.id = "thé_view"
    //document.body.appendChild(create_modal())
};

window.onload = () => {
    setup_doc("thewebsite");
};