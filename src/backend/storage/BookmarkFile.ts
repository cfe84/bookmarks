import { Folder, Bookmark } from "../models";

const rootNodeId: string = "root";
const rootNodeName: string = "Home";

class BookmarkFile {
    public bookmarks: { [bookmarkId: string]: Bookmark } = {}
    public folders: { [folderId: string]: Folder } = {}
    constructor(initialize = false) {
        if (initialize) {
            const folder = new Folder();
            folder.id = rootNodeId;
            folder.name = rootNodeName;
            this.folders[rootNodeId] = folder;
        }
    }
}

export { BookmarkFile }