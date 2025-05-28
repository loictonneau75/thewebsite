import * as DH from "../tools/domHelper.js"
import * as utils from "../tools/utils.js"

export class backgroundManager{
    constructor(config){
        this.wrapper = DH.createCustomElement("div", {
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
        this.wrapper.append(this.video, this.overlay)
    }
    build(){
        return this.wrapper
    }

    updateOverlayOpacity(fadeStart, color, baseOpacity) {
        const maxOpacity = 1
        const finalOpacity = baseOpacity + ((maxOpacity - baseOpacity) * this.calculateFadeRatioOverlay(fadeStart))
        this.overlay.style.backgroundColor = `rgba(${color}, ${finalOpacity})`;
    }

    calculateFadeRatioOverlay(fadeStart) {
        const titleHeight = document.querySelector(".ts-title").getBoundingClientRect().top
        if (titleHeight < 0) return 1
        else if (titleHeight <= fadeStart) return 1 - (titleHeight / fadeStart)
    }

    getColorAndOpacity(element){
        const rgbaRegex = /rgba?\(([^)]+)\)/
        const match = getComputedStyle(element).backgroundColor.match(rgbaRegex)
        const parts = match[1].split(',').map(p => p.trim());
        const r = parts[0];
        const g = parts[1];
        const b = parts[2];
        const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;

        return {
            color: `${r}, ${g}, ${b}`,
            opacity: a
        };
    }

}