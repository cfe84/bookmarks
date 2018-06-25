import { IFileProvider, JsonSerializer } from ".";
import { BlobService } from "azure-storage";
import { BookmarkFile } from "./BookmarkFile";

const callbackCreator = (resolve: any, reject: any) => (err: Error, res: any) => {
    if (err) {
        reject(err);
    } else {
        resolve(res);
    }
}

class AzureBlobStorageFileProvider implements IFileProvider {
    bookmarksFileName = "bookmarks.json";
    serializer = new JsonSerializer()
    blobService: BlobService;
    constructor(connectionString: string) {
        this.blobService = new BlobService(connectionString);
    }

    private getUserContainerAsync(userId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const containerName = `user-${userId}`;
            return this.blobService.createContainerIfNotExists(`user-${userId}`, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(containerName);
                }
            });
        });
    }

    getBookmarkFileAsync(userId: string): Promise<BookmarkFile> {
        let containerName = "";
        return this.getUserContainerAsync(userId)
            .then((container) => {
                return new Promise((resolve, reject) => {
                    containerName = container;
                    this.blobService.doesBlobExist(container, this.bookmarksFileName, callbackCreator(resolve, reject));
                });
            })
            .then((exists: any) => {
                return new Promise<BookmarkFile>((resolve, reject) => {
                    if (exists.exists) {
                        this.blobService.getBlobToText(containerName, this.bookmarksFileName, (err, contents) => {
                            if (err) { return reject(err) ;}
                            else { return resolve(this.serializer.Deserialize(contents)) ;}
                        });
                    }
                    else {
                        return resolve(new BookmarkFile(true));
                    }
                });
            });
    }

    saveBookmarkFileAsync(userId: string, bookmarks: any): Promise<void> {
        let containerName = "";
        const contents = this.serializer.Serialize(bookmarks);
        return this.getUserContainerAsync(userId)
            .then((containerName) => {
                return new Promise<void>((resolve, reject) => this.blobService.createBlockBlobFromText(
                    containerName, 
                    this.bookmarksFileName, 
                    contents, 
                    callbackCreator(resolve, reject)));
            });
    }
}

export { AzureBlobStorageFileProvider }