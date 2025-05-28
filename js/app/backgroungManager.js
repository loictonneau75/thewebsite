import * as DH from "../tools/domHelper.js"
import * as utils from "../tools/utils.js"

export class backgroundManager{
    constructor(config){
        this.wrapper = DH.createCustomElement("div", {classList: ["css_bg"]})
        this.video = DH.createCustomElement("video", {classList: ["css_bg-video"], src: utils.getAbsoltutePath(config.bgVideo), type: "video/mp4", muted: true, autoplay: true, loop: true})
        this.overlay = DH.createCustomElement("div", {classList: ["css_bg-overlay"]})
        this.wrapper.append(this.video, this.overlay)
    }

    build(){
        return this.wrapper
    }
}