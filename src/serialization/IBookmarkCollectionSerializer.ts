import { BookmarkCollection } from "../models/BookmarkCollection";

interface IBookmarkCollectionSerializer {
    serialize(collection: BookmarkCollection): string
    deserialize(serializedCollection: string): BookmarkCollection 
}

export { IBookmarkCollectionSerializer };