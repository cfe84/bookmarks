import { IItem } from "./IItem";

class Bookmark implements IItem {
    public description: string = "";
    public keyword: string = "";
    public tags: Array<string> = new Array<string>();
    constructor(public name: string = "", public href: string = "") {
    }
}

export { Bookmark }