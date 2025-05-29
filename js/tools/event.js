import * as utils from "./utils.js"

export function setupscroll(){
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
