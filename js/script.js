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


const overlay = document.querySelector(".bg-overlay")
const bgFadeEnd = document.querySelector(".ts-title").getBoundingClientRect().top
const {color: bgColor, opacity: bgOpacity} = utils.getColorAndOpacity(overlay, "backgroundColor")

const welcome = document.querySelector(".ts-text")
const welcomeFadeEnd = welcome.getBoundingClientRect().top
const {color: welcomeColor, opacity: welcomeOpacity} = utils.getColorAndOpacity(welcome, "color")



window.addEventListener("scroll", () => {
    utils.updateElementOpacity(bgFadeEnd, bgColor ,bgOpacity, 1, ".ts-title", overlay, "backgroundColor")
    utils.updateElementOpacity(welcomeFadeEnd, welcomeColor, welcomeOpacity, 0,".ts-text", welcome, "color")
})
