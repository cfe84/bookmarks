import { Folder, Bookmark, Icon } from "../models";

class BookmarkCollection {
    public folders: Folder[] = [];
    public bookmarks: Bookmark[] = [];
    public icons: Icon[] = [];
    public rootFolder: Folder;
    
    constructor() {
        this.rootFolder = new Folder("Home");
        this.rootFolder.id = "root";
    }
}

export { BookmarkCollection }