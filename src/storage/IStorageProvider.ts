import {IItem} from "../models/IItem";

interface IStorageProvider {
    getSerializedBookmarkCollectionAsync(userId: string): Promise<string>;
    saveSerializedBookmarkCollectionAsync(userId: string, serializedBookmarkCollection: string): Promise<void>;
}

export { IStorageProvider }