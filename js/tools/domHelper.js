export function createCustomElement(tag, {classList = [], ...props} = {}){
    if (!tag || typeof(tag) !== "string") throw new Error("createCustomElement: 'tag' parameter is requiredf and must be a string");
    if (tag === "video" && (!props.src|| !props.type)) throw new Error("createCustomElement: <video> element must have a <src> and a <type> propertie");
    const element = document.createElement(tag);
    if (classList.length) element.classList.add(...classList);
    for (const [key, val] of Object.entries(props)) element[key] = val;
    return element
}