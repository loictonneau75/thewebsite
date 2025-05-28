import * as DH from "../tools/domHelper.js";

export class Language{
    constructor(label){
        if (!localStorage.getItem("lang")) localStorage.setItem("lang", "en")
        this.wrapper = DH.createCustomElement("div", {classList:["language"]})
        for (const lang in label){
            const flag = DH.createCustomElement("img", {classList:["language-flag"], src: label[lang].flag, alt: lang, title: lang})
            this.wrapper.appendChild(flag)
            flag.addEventListener("click", () => {
                localStorage.setItem("lang", lang)
                location.reload()
            })
        }
    }
    build(){
        return this.wrapper
    }
}