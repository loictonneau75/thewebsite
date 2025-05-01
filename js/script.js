import { create_form, attachFormHandler } from "./form/index.js";
import { displayTeas } from "./visualisation.js";

function setup_doc(name) {
    document.title = name;

    const h1 = document.createElement('h1');
    h1.innerText = name;
    h1.classList.add('text-center');

    const formWrapper = document.createElement('div');
    formWrapper.classList.add('container', 'p-5', "bg-secondary", "my-5");
    formWrapper.append(h1, create_form());

    const h2 = document.createElement("h2");
    h2.innerText = "Liste de mes thés";

    const teaViewWrapper = document.createElement('div');
    teaViewWrapper.classList.add("container", "p-5", "bg-secondary")
    teaViewWrapper.append(h2, displayTeas())

    document.body.append(formWrapper, teaViewWrapper);
    
};

window.onload = () => {
    setup_doc("Tea Time");
};