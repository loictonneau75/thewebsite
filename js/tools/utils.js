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
    return localStorage.getItem("lang")
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

export function calculateFadeRatio(fadeEnd, offsetElement) {
    const ViewportOffsetTop = offsetElement.getBoundingClientRect().top
    if (ViewportOffsetTop < 0) return 1
    else if (ViewportOffsetTop <= fadeEnd) return 1 - (ViewportOffsetTop / fadeEnd)
}

export function updateElementOpacity(element, fadeEnd, colorData, maxOpacity, offsetElement, styletochange) {
    const finalOpacity = baseOpacity + ((maxOpacity - colorData.opacity) * calculateFadeRatio(fadeEnd, offsetElement))
    element.style[styletochange] = `rgba(${colorData.color}, ${finalOpacity})`;
}

