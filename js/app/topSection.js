import * as DH from "../tools/domHelper.js"


export class TopSection{
    constructor(config, label, lang){
        this.wrapper = DH.createCustomElement("div", {
            classList:["css_ts"]
        })
        this.welcome = DH.createCustomElement("p", {
            innerText: label[lang].welcome ,
            classList: ["css_ts-text"]
        })
        this.title = DH.createCustomElement("p", {
            innerText: config.siteName,
            classList: ["css_ts-title"]})
        this.wrapper.append(this.welcome, this.title)
    }
    build(){
        return this.wrapper
    }
}