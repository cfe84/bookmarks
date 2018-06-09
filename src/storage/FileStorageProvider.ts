import { IStorageProvider } from "./IStorageProvider";
import { IItem } from "../models/IItem";
import fs from "fs";
import path from "path";

class FileStorageProvider implements IStorageProvider {
    private getUserFolder(userId: string) {
        return path.join(this.folder, userId);
    }

    private getFilename(userId: string, collectionId: string) {
        return path.join(this.getUserFolder(userId), `${collectionId}.json`);
    }

    getSerializedBookmarkCollectionAsync(userId: string, collectionId: string): Promise<string> {
        const filename = this.getFilename(userId, collectionId);
        return new Promise<string>((resolve, reject) => {
            if (!fs.existsSync(filename)) {
                return reject(`File doesn't exist: ${filename}`);
            }
            fs.readFile(filename, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(`${data}`);
                }
            });
        }) 
    }

    private createUserFolderIfNotExist(userId: string): void {
        const userFolder = this.getUserFolder(userId);
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder);
        }
    }

    async saveSerializedBookmarkCollectionAsync(userId: string, collectionId: string, serializedBookmarkCollection: string): Promise<void> {
        const filename = this.getFilename(userId, collectionId);
        return new Promise<void>((resolve, reject) => {
            try {            
                this.createUserFolderIfNotExist(userId);
            } catch (err) {
                return reject(err);
            }
            fs.writeFile(filename, serializedBookmarkCollection, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        })
    }
    constructor(private folder: string) {

    }
}

export { FileStorageProvider }