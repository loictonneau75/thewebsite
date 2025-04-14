function setup_doc(name) {
    document.title = name;
    const h1 = document.createElement('h1');
    h1.innerText = name;
    document.body.appendChild(h1);
};

function create_form(){
    let form = document.createElement("form")
    form.id == "formulaire-the"
    let label
    return form
}

window.onload = () => {
    setup_doc("thewebsite");
    document.body.appendChild(create_form())
};