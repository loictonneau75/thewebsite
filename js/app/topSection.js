import * as DH from "../tools/domHelper.js"


export class TopSection{
    constructor(config, label, lang){
        this.section = DH.createCustomElement("section", {
            classList:["ts"]
        })
        this.welcome = DH.createCustomElement("p", {
            innerText: label[lang].welcome ,
            classList: ["ts-text"]
        })
        this.title = DH.createCustomElement("p", {
            innerText: config.siteName,
            classList: ["ts-title"]})
        this.section.append(this.welcome, this.title)
    }
    build(){
        return this.section
    }
}