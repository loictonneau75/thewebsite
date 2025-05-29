import * as DH from "../tools/domHelper.js"

export class Form{
    constructor(){
        this.section = DH.createCustomElement("section", {
            classList: ["form"]
        })
    }
    build(){
        return this.section
    }
}