import * as utils from "./utils.js"

export function setupscroll(){
    const overlay = document.querySelector(".bg-overlay")
    const title = document.querySelector(".ts-title")
    const welcome = document.querySelector(".ts-text")
    const form = document.querySelector(".form")
    const bgColorData = utils.getColorAndOpacity(overlay, "backgroundColor")
    const welcomeColorData = utils.getColorAndOpacity(welcome, "color")


    window.addEventListener("scroll", () => {
        utils.updateElementOpacity(overlay, title, bgColorData, 0.8, "backgroundColor")
        utils.updateElementOpacity(welcome, welcome, welcomeColorData, 0, "color")
        utils.stickyWithTransform(title, welcome, form, window.innerHeight * 0.1, 10)
    })
}

export function flagclick(language, components = []) {
    const flags = document.querySelectorAll(".language-flag")
    flags.forEach(flag => {
        flag.addEventListener("click", () => {
            localStorage.setItem("lang", flag.title)
            components.forEach(([Classe, args]) => {
                language.changeLang(new Classe(...args))
            })
            setupscroll()
        })
    })
}
