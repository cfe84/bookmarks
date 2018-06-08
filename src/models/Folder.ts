import { IItem } from "./IItem";
import { Bookmark } from "./Bookmark";

class Folder implements IItem{
    public bookmarks: Array<Bookmark> = new Array<Bookmark>();
    public folders: Array<Folder> = new Array<Folder>();
    public description: string = "";
    constructor(public name: string = "") {
    }
}

export { Folder }