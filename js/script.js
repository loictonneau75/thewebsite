import { create_form, attachFormHandler } from "./form/index.js";
import { displayTeas } from "./visualisation.js";

function spacer(height = 2) {
    height = `${height.toString()}rem`
    const spacer = document.createElement('div');
    spacer.style.height = height;
    spacer.style.backgroundColor = 'transparent';
    spacer.style.width = '100%';
    return spacer;
}

function setup_doc(name) {
    document.title = name;
    const h1 = document.createElement('h1');
    h1.innerText = name;
    h1.classList.add('text-center', 'mb-4');

    const mainWrapper = document.createElement('div');
    mainWrapper.classList.add('container-fluid', 'p-5', "bg-secondary");

    mainWrapper.appendChild(h1);
    mainWrapper.appendChild(create_form());
    
    document.body.appendChild(spacer())
    document.body.appendChild(mainWrapper);

    attachFormHandler()

    document.body.appendChild(displayTeas())

};

window.onload = () => {
    setup_doc("thewebsite");
};