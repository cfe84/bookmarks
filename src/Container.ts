import { IBookmarkCollectionSerializer } from "./serialization/IBookmarkCollectionSerializer";
import { IStorageProvider } from "./storage/IStorageProvider";

class Container {
    constructor(
        public bookmarkCollectionSerializer: IBookmarkCollectionSerializer,
        public storageProvider: IStorageProvider
    ) { }
}

export { Container }