import { IItem } from "./IItem";
import { Bookmark } from "./Bookmark";
const uuid = require("uuid/v4");

class Folder implements IItem{
    public id: string = uuid();
    public bookmarkIds: Array<string> = new Array<string>();
    public folderIds: Array<string> = new Array<string>();
    public description: string = "";
    constructor(public name: string = "") { }
}

export { Folder }