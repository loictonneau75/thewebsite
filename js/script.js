import * as utils from "./tools/utils.js"
import * as DH from "./tools/domHelper.js"
import * as BGM from "./app/backgroungManager.js"
import * as TS from "./app/topSection.js"


const label = await utils.getConfigValue("json/label.json")
const config = await utils.getConfigValue("json/data.json")

document.title = config.siteName
document.head.appendChild(DH.createCustomElement("link", {rel: "icon", href: config.favicon, type: "image/x-icon"}))

const background = new BGM.backgroundManager(config)
document.body.appendChild(background.build())

let lang = "fr"
const topSection = new TS.TopSection(config, label, lang)
document.body.appendChild(topSection.build())



document.body.appendChild(DH.createCustomElement("div", {classList: ["divtest", "bleu"]}))
document.body.appendChild(DH.createCustomElement("div", {classList: ["divtest", "rouge"]}))


const fadeStart = document.querySelector(".ts-title").getBoundingClientRect().top
const overlay = document.querySelector(".bg-overlay")
const {color, opacity} = background.getColorAndOpacity(overlay)
window.addEventListener("scroll", () => {
    background.updateOverlayOpacity(fadeStart, color ,opacity)
    topSection
})
