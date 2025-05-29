import * as DH from "../tools/domHelper.js"
import * as utils from "../tools/utils.js"

export class Form{
    constructor(config, label){
        this.collectablesNames = config.collectables.en
        this.lang = utils.getlang()
        this.label = label[this.lang]
        this.fieldsData = config.fields

        this.section = DH.createCustomElement("section", {
            classList: ["form-section"]
        })
        this.form = DH.createCustomElement("form", {
            classList: ["form"],
            autocomplete :"off"
        })
        this.fieldsData.forEach(fieldRowData => this.buildRow(fieldRowData));
        const submitButton = DH.createCustomElement("button", {
            type: "button",
            innerText: this.label.save
        })
        this.section.appendChild(this.form)
        this.form.appendChild(submitButton)
    }
    build(){
        return this.section
    }

    buildRow(rowData){
        const row = DH.createCustomElement("div")
        Object.values(rowData).forEach(inputData => this.buildInput(inputData, row))
        this.form.appendChild(row)
    }

    buildInput(data, parent){
        const inputWrapper = DH.createCustomElement("div")
        inputWrapper.appendChild(this.createSimpleInput(data))
        parent.appendChild(inputWrapper)
    }

    createSimpleInput(data){
        const input = DH.createCustomElement("input", {
            id: data.id,
            type: "text",
            placeholder: data.label[this.lang]
        })
        return input
    }
}