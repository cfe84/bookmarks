import { IStorageProvider } from "./IStorageProvider";
import { IItem } from "../models/IItem";
import fs from "fs";
import path from "path";

class FileStorageProvider implements IStorageProvider {
    private getFilename(userId: string) {
        return path.join(this.folder, `${userId}.json`);
    }

    getSerializedBookmarkCollectionAsync(userId: string): Promise<string> {
        const filename = this.getFilename(userId);
        return new Promise<string>((resolve, reject) => {
            fs.readFile(filename, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(`${data}`);
                }
            });
        }) 
    }
    async saveSerializedBookmarkCollectionAsync(userId: string, serializedBookmarkCollection: string): Promise<void> {
        const filename = this.getFilename(userId);
        return new Promise<void>((resolve, reject) => {
            if (!fs.existsSync(this.folder)) {
                try {
                    fs.mkdirSync(this.folder);
                } catch (err) {
                    return reject(err);
                }
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