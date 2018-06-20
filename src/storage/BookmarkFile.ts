import { Folder, Bookmark } from "../models";

const rootNodeId: string = "root";

class BookmarkFile {
    public bookmarks: { [bookmarkId: string]: Bookmark } = {}
    public folders: { [folderId: string]: Folder } = {}
    constructor(initialize = false) {
        if (initialize) {
            const folder = new Folder();
            folder.id = rootNodeId;
            this.folders[rootNodeId] = folder;
        }
    }
}

export { BookmarkFile }