import { IItem } from "./IItem";
import { Bookmark } from "./Bookmark";
const uuid = require("uuid/v4");

class Folder implements IItem{
    public id: string = uuid();
    public bookmarks: Array<Bookmark> = new Array<Bookmark>();
    public folders: Array<Folder> = new Array<Folder>();
    public description: string = "";
    constructor(public name: string = "") { }
}

export { Folder }