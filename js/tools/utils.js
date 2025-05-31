export function getAbsoltutePath(relativePath) {
    let rootPath = window.location.pathname;
    rootPath = rootPath.endsWith('/') ? rootPath : rootPath + '/';
    return rootPath + relativePath
}

export async function getConfigValue(path) {
    const response = await fetch(getAbsoltutePath(path))
    return await response.json()
}

export function getlang(){
    return localStorage.getItem("lang") || "en"
}

export function getColorAndOpacity(element, color){
    const rgbaRegex = /rgba?\(([^)]+)\)/
    const style = getComputedStyle(element)
    const match = getComputedStyle(element)[color].match(rgbaRegex)
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

export function calculateFadeRatio(referenceElement) {
    const distanceFromViewportTop = referenceElement.getBoundingClientRect().top
    const distanceFromPageTop = distanceFromViewportTop + window.scrollY
    if (distanceFromViewportTop < 0) return 1
    else if (distanceFromViewportTop <= distanceFromPageTop) return 1 - (distanceFromViewportTop / distanceFromPageTop)
}

export function updateElementOpacity(targetElement, referenceElement, baseColorData, maxOpacity, cssProperty) {
    const finalOpacity = baseColorData.opacity + ((maxOpacity - baseColorData.opacity) * calculateFadeRatio(referenceElement))
    targetElement.style[cssProperty] = `rgba(${baseColorData.color}, ${finalOpacity})`;
}

let scrollStart = null;
export function stickyWithTransform(targetElement, elementTriggerStart, elementTriggerStop, offsetTop, offsetBottom) {
    const hasEnteredSticky = elementTriggerStart.getBoundingClientRect().bottom <= offsetTop;
    const hasReachedStop = elementTriggerStop.getBoundingClientRect().top - offsetBottom <= targetElement.offsetHeight + offsetTop;
    if (hasEnteredSticky && !hasReachedStop) {
        if (scrollStart === null) scrollStart = window.scrollY;
        const deltaScroll = window.scrollY - scrollStart;
        targetElement.style.transform = `translateY(${deltaScroll}px)`;
    }
}


export function reloadComponent(components = []){
    components.forEach(([Classe, args]) => {
    const component = new Classe(...args)
    const old = document.querySelector(`.${component.section.classList[0]}`)
    const _new = component.build()
    old.replaceWith(_new)
    })
}



