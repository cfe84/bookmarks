const attachToElement = function (element, component){
    const attachment = document.createElement("span");
    element.appendChild(attachment);
    component.$mount(attachment)
}

export default attachToElement;