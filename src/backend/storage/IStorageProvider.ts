import { IStorageTransaction } from "./IStorageTransaction";
import { IStorageOperations } from "./IStorageOperations";

interface IStorageProvider extends IStorageOperations {
    beginTransactionAsync(): Promise<IStorageTransaction>;
}

export { IStorageProvider }