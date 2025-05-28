import * as DH from "../tools/domHelper.js"
import * as utils from "../tools/utils.js"

export class backgroundManager{
    constructor(config){
        this.wrapper = DH.createCustomElement("div", {classList: ["css_bg"]})
        this.video = DH.createCustomElement("video", {classList: ["css_bg-vid"], src: utils.getAbsoltutePath(config.bgVideo), type: "video/mp4", muted: true, autoplay: true, loop: true})
        this.wrapper.append(this.video)
    }

    build(){
        return this.wrapper
    }
}