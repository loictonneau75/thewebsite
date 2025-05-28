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



document.body.appendChild(DH.createCustomElement("div", {classList: ["divtest"]}))
document.body.appendChild(DH.createCustomElement("div", {classList: ["divtest"]}))


const overlay = document.querySelector(".bg-overlay")
const title = document.querySelector(".ts-title")
const bgFadeEnd = title.getBoundingClientRect().top
const bgColorData = utils.getColorAndOpacity(overlay, "backgroundColor")

const welcome = document.querySelector(".ts-text")
const welcomeFadeEnd = welcome.getBoundingClientRect().top
const welcomeColorData = utils.getColorAndOpacity(welcome, "color")



window.addEventListener("scroll", () => {
    utils.updateElementOpacity(overlay, bgFadeEnd, bgColorData, 0.8, title, "backgroundColor")
    utils.updateElementOpacity(welcome, welcomeFadeEnd, welcomeColorData, 0,welcome, "color")
})
