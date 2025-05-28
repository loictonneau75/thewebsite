import * as DH from "../tools/domHelper.js"
import * as utils from "../tools/utils.js"

export class backgroundManager{
    constructor(config){
        this.wrapper = DH.createCustomElement("div", {
            classList: ["css_bg"]
        })
        this.video = DH.createCustomElement("video", {
            classList: ["css_bg-video"], 
            src: utils.getAbsoltutePath(config.bgVideo), 
            type: "video/mp4", 
            muted: true, 
            autoplay: true, 
            loop: true
        })
        this.overlay = DH.createCustomElement("div", {
            classList: ["css_bg-overlay"]
        })
        this.wrapper.append(this.video, this.overlay)
    }
    build(){
        return this.wrapper
    }

    updateOverlayOpacity() {
        let ratio = this.calculateFadeRatio()
        const rgbaRegex = /rgba?\(([^)]+)\)/
        if (this.overlay) {
            const backgroundColor = getComputedStyle(this.overlay).backgroundColor.match(/rgba?\(([^)]+)\)/)[1]
            const baseOpacity = parseFloat(backgroundColor.split(',')[3] || 1);
            console.log("----- base opacity -----")
            console.log(baseOpacity)
            const maxIncrease = 0.5;
            const finalOpacity = baseOpacity + ratio * maxIncrease;
            console.log("----- final opacity -----")
            console.log(finalOpacity)
            this.overlay.style.backgroundColor = `rgba(0, 0, 0, ${finalOpacity})`;
        }
    }
    calculateFadeRatio(){
        console.log("----- scrollY -----")
        console.log(window.scrollY)
        return 0
    }

}