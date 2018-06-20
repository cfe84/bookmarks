import { BookmarkFile } from "./BookmarkFile";
import { Bookmark, Folder } from "../models";

class JsonSerializer {
    constructor(private mapPrototypes: boolean = true){}

    public Serialize(bookmarkFile:BookmarkFile): string {
        return JSON.stringify(bookmarkFile, null, 2);
    }

    public Deserialize(serializedBookmarkFile: string): BookmarkFile {
        const file = JSON.parse(serializedBookmarkFile);
        if (this.mapPrototypes) {
            for(let bookmarkid in file.bookmarks) {
                if (file.bookmarks.hasOwnProperty(bookmarkid)) {
                    file.bookmarks[bookmarkid] = Object.assign(new Bookmark(), file.bookmarks[bookmarkid]);
                }
            }
            for(let folderId in file.folders) {
                if (file.folders.hasOwnProperty(folderId)) {
                    file.folders[folderId] = Object.assign(new Folder(), file.folders[folderId]);
                }
            }
        }
        return Object.assign(new BookmarkFile(false), file);
    }
}

export { JsonSerializer }