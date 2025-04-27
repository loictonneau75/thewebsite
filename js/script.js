import { create_form, attachFormHandler } from "./form/index.js";
import { displayTeas } from "./visualisation.js";

function setup_doc(name) {
    document.title = name;
    const h1 = document.createElement('h1');
    h1.innerText = name;
    document.body.appendChild(h1);
    document.body.appendChild(create_form())
    attachFormHandler()
    document.body.appendChild(displayTeas())

};

window.onload = () => {
    setup_doc("thewebsite");
};