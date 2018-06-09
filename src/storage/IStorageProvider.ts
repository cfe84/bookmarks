import {IItem} from "../models/IItem";

interface IStorageProvider {
    getSerializedBookmarkCollectionAsync(userId: string, collectionId: string): Promise<string>;
    saveSerializedBookmarkCollectionAsync(userId: string, collectionId: string, serializedBookmarkCollection: string): Promise<void>;
}

export { IStorageProvider }