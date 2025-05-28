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

    updateOverlayOpacity(fadeStart, baseOpacity) {
        let ratio = this.calculateFadeRatio(fadeStart)
        const maxOpacity = 0.8
        const finalOpacity = baseOpacity + ((maxOpacity - baseOpacity) * ratio)
        this.overlay.style.backgroundColor = `rgba(0, 0, 0, ${finalOpacity})`;
    }

    calculateFadeRatio(fadeStart) {
        let ratio = 0;
        const titleHeight = document.querySelector(".css_ts-title").getBoundingClientRect().top
        if (titleHeight < 0) ratio = 1
        else if (titleHeight <= fadeStart) ratio = 1 - (titleHeight / fadeStart)
        return ratio
    }

    getOpacity(){
        const rgbaRegex = /rgba?\(([^)]+)\)/
        const backgroundColor = getComputedStyle(this.overlay).backgroundColor.match(rgbaRegex)[1]
        return parseFloat(backgroundColor.split(',')[3] || 1);
    }

}