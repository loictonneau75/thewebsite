import * as DH from "../tools/domHelper.js";

export class Language{
    constructor(label){
        this.wrapper = DH.createCustomElement("div", {classList:["language"]})
        for (const lang in label){
            const flag = DH.createCustomElement("img", {classList:["language-flag"], src: label[lang].flag, alt: lang, title: lang})
            this.wrapper.appendChild(flag)
        }
    }
    build(){
        return this.wrapper
    }

    changeLang(component){
        const old = document.querySelector(`.${component.section.classList[0]}`)
        const _new = component.build()
        old.replaceWith(_new)
    }
}