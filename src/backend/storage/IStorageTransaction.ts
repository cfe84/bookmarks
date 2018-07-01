import { IStorageOperations } from "./IStorageOperations";

interface IStorageTransaction extends IStorageOperations {
    commitAsync(): Promise<void>;
}

export { IStorageTransaction }