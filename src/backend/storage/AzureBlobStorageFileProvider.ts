import { IFileProvider, JsonSerializer, Asset } from ".";
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

    private getFileContentAsync(userId: string, fileName: string): Promise<string> {
        let containerName = "";
        return this.getUserContainerAsync(userId)
            .then((container) => {
                return new Promise((resolve, reject) => {
                    containerName = container;
                    this.blobService.doesBlobExist(container, fileName, callbackCreator(resolve, reject));
                });
            })
            .then((exists: any) => {
                return new Promise<string>((resolve, reject) => {
                    if (exists.exists) {
                        this.blobService.getBlobToText(containerName, fileName, (err, contents) => {
                            if (err) { return reject(err) ;}
                            else { return resolve(contents) ;}
                        });
                    }
                    else {
                        return reject("not found");
                    }
                });
            });
    }

    private saveFileContentAsync(userId:string, fileName: string, contents: string): Promise<void> {
        let containerName = "";
        return this.getUserContainerAsync(userId)
            .then((containerName) => {
                return new Promise<void>((resolve, reject) => this.blobService.createBlockBlobFromText(
                    containerName, 
                    fileName, 
                    contents, 
                    callbackCreator(resolve, reject)));
            });
    }

    async getBookmarkFileAsync(userId: string): Promise<BookmarkFile> {
        try {
            const contents = await this.getFileContentAsync(userId, this.bookmarksFileName);
            return this.serializer.Deserialize(contents);
        } catch(error) {
            if (error === "not found") {
                return new BookmarkFile(true);
            }
            throw error;
        }
    }

    async saveBookmarkFileAsync(userId: string, bookmarks: any): Promise<void> {
        const contents = this.serializer.Serialize(bookmarks);
        await this.saveFileContentAsync(userId, this.bookmarksFileName, contents);
    }

    async getAssetAsync(userId: string, assetId: string): Promise<Asset> {
        const content = await this.getFileContentAsync(userId, assetId);
        return new Asset(assetId, content);
    }
    async saveAssetAsync(userId: string, asset: Asset): Promise<void> {
        await this.saveFileContentAsync(userId, asset.id, asset.content);
    }
}

export { AzureBlobStorageFileProvider }