import { IBookmarkCollectionSerializer } from "./IBookmarkCollectionSerializer";
import { BookmarkCollection } from "../models/BookmarkCollection";
import { Folder } from "../models/Folder";
import { Bookmark } from "../models/Bookmark";


class JsonBookmarkCollectionSerializer implements IBookmarkCollectionSerializer {
    serialize(collection: BookmarkCollection): string {
        return JSON.stringify(collection);
    }

    private setPrototypesRec(folder: Folder) {
        folder.bookmarks.forEach(bookmark => {
            Object.setPrototypeOf(bookmark, Bookmark.prototype);
        });
        folder.folders.forEach(subfolder => {
            Object.setPrototypeOf(subfolder, Folder.prototype);
            this.setPrototypesRec(subfolder);
        })
    }

    deserialize(serializedCollection: string): BookmarkCollection {
        const jsonCollection: any = JSON.parse(serializedCollection);
        const collection: BookmarkCollection = Object.setPrototypeOf(jsonCollection,
            BookmarkCollection.prototype);
        this.setPrototypesRec(collection);
        return collection;
    }
}

export { JsonBookmarkCollectionSerializer }