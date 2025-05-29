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

export function calculateFadeRatio(fadeDistance, referenceElement) {
    const distanceFromViewportTop = referenceElement.getBoundingClientRect().top
    if (distanceFromViewportTop < 0) return 1
    else if (distanceFromViewportTop <= fadeDistance) return 1 - (distanceFromViewportTop / fadeDistance)
}

export function updateElementOpacity(targetElement, referenceElement, fadeDistance, baseColorData, maxOpacity, cssProperty) {
    const finalOpacity = baseColorData.opacity + ((maxOpacity - baseColorData.opacity) * calculateFadeRatio(fadeDistance, referenceElement))
    targetElement.style[cssProperty] = `rgba(${baseColorData.color}, ${finalOpacity})`;
}

