import * as utils from "./tools/utils.js"
import * as DH from "./tools/domHelper.js"

import * as Language from "./app/language.js"
import * as BGM from "./app/backgroungManager.js"
import * as TS from "./app/topSection.js"
import * as F from "./app/form.js"


const label = await utils.getConfigValue("json/label.json")
const config = await utils.getConfigValue("json/data.json")

document.title = config.siteName
document.head.appendChild(DH.createCustomElement("link", {rel: "icon", href: config.favicon, type: "image/x-icon"}))

const background = new BGM.backgroundManager(config)
const language = new Language.Language(label)
const topSection = new TS.TopSection(config, label)
const form = new F.Form()

document.body.append(
    background.build(), 
    language.build(), 
    topSection.build(), 
    form.build())





document.body.appendChild(DH.createCustomElement("div", {classList: ["divtest", "bleu"]}))
document.body.appendChild(DH.createCustomElement("div", {classList: ["divtest", "rouge"]}))





const overlay = document.querySelector(".bg-overlay")
const title = document.querySelector(".ts-title")
const bgDistanceFromTop = title.getBoundingClientRect().top + window.scrollY
const bgColorData = utils.getColorAndOpacity(overlay, "backgroundColor")

const welcome = document.querySelector(".ts-text")
const welcomeDistanceFromTop = welcome.getBoundingClientRect().top + window.scrollY
const welcomeColorData = utils.getColorAndOpacity(welcome, "color")


window.addEventListener("scroll", () => {
    utils.updateElementOpacity(overlay, title, bgDistanceFromTop, bgColorData, 0.8, "backgroundColor")
    utils.updateElementOpacity(welcome, welcome, welcomeDistanceFromTop, welcomeColorData, 0, "color")
})
