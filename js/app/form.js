import * as DH from "../tools/domHelper.js"
import * as utils from "../tools/utils.js"

export class Form{
    constructor(config, label){
        this.collectablesNames = config.collectables.en
        //this.label = label[utils.getlang()]
        this.fields = config.fields
        this.section = DH.createCustomElement("section", {
            classList: ["form-section"]
        })
        this.form = DH.createCustomElement("form", {
            classList: ["form"],
            autocomplete :"off"
        })
        this.section.appendChild(this.form)
    }
    build(){
        return this.section
    }
}