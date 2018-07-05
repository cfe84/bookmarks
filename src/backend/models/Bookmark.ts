import { IItem } from "./IItem";
const uuid = require("uuid/v4");

class Bookmark implements IItem {
    public id: string = uuid();
    public description: string = "";
    public keyword: string = "";
    public iconUrl: string = "";
    public iconId: string = "";
    public tags: Array<string> = new Array<string>();
    constructor(public name: string = "", public href: string = "") {
    }
}

export { Bookmark }