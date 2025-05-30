import * as utils from "./tools/utils.js"
import * as DH from "./tools/domHelper.js"
import * as event from "./tools/event.js"

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
const form = new F.Form(config, label)

document.body.append(
    background.build(), 
    language.build(), 
    topSection.build(), 
    form.build())


event.setupscroll()
event.flagclick([
    [TS.TopSection, [config, label]],
    [F.Form,[config, label]]
])








