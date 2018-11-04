import { IBookmarksStorageTransaction } from "./IBookmarksStorageTransaction";
import { IBookmarksStorageOperations } from "./IBookmarksStorageOperations";

interface IBookmarksStorageProvider extends IBookmarksStorageOperations {
    beginTransactionAsync(): Promise<IBookmarksStorageTransaction>;
}

export { IBookmarksStorageProvider }