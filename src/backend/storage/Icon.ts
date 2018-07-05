const uuid = require("uuid/v4")

class Icon {
    constructor(public content = "", public id = uuid()) {}
}

export { Icon }