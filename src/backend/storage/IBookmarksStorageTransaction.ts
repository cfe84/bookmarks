import { IBookmarksStorageOperations } from "./IBookmarksStorageOperations";

interface IBookmarksStorageTransaction extends IBookmarksStorageOperations {
    commitAsync(): Promise<void>;
}

export { IBookmarksStorageTransaction }