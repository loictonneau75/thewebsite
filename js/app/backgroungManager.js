import * as DH from "../tools/domHelper.js"
import * as utils from "../tools/utils.js"

export class backgroundManager{
    constructor(config){
        this.section = DH.createCustomElement("section", {
            classList: ["bg"]
        })
        this.video = DH.createCustomElement("video", {
            classList: ["bg-video"], 
            src: utils.getAbsoltutePath(config.bgVideo), 
            type: "video/mp4", 
            muted: true, 
            autoplay: true, 
            loop: true
        })
        this.overlay = DH.createCustomElement("div", {
            classList: ["bg-overlay"]
        })
        this.section.append(this.video, this.overlay)
    }
    build(){
        return this.section
    }

}