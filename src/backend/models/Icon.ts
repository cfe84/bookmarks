const uuid = require("uuid/v4")

class Icon {
    constructor(public content = "", public contentType = "data/png", public id = uuid()) {}
}

export { Icon }