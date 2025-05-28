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