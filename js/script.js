import { create_form, attachFormHandler } from "./form/index.js";
import { displayTeas } from "./visualisation.js";

function setup_doc(name) {
    document.title = name;
    const h1 = document.createElement('h1');
    h1.innerText = name;
    h1.classList.add('text-center');
    const mainWrapper = document.createElement('div');
    mainWrapper.classList.add('container-fluid', 'p-5', "bg-secondary", "my-5");
    mainWrapper.append(h1, create_form());
    document.body.append(mainWrapper, displayTeas());
    attachFormHandler()
};

window.onload = () => {
    setup_doc("Tea Time");
};