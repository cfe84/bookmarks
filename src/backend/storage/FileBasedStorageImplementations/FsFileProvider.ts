import { IFileProvider } from "..";
import fs from "fs";
import path from "path";
import { BookmarkFile } from "../FileBasedStorage/BookmarkFile";
import { JsonSerializer, Asset } from "..";

class FsFileProvider implements IFileProvider {
    serializer = new JsonSerializer()
    constructor(private folder: string) {}

    private createFolderIfNotExist(folder: string) {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
    }

    private getUserFolder(userId: string): string {
        this.createFolderIfNotExist(this.folder);
        return path.join(this.folder, userId);
    }

    private getFilePath(userId: string, fileName: string): string {
        const folder = this.getUserFolder(userId);
        this.createFolderIfNotExist(folder);
        return path.join(folder, fileName);
    }
    
    private getBookmarkFilePath(userId: string): string {
        return this.getFilePath(userId, `bookmark.json`);
    }

    async getBookmarkFileAsync(userId: string): Promise<any> {
        const file = this.getBookmarkFilePath(userId);
        if (fs.existsSync(file)) {
            const contents = fs.readFileSync(file);
            const bookmarks = this.serializer.Deserialize(contents.toString());
            return bookmarks;
        } else {
            return new BookmarkFile(true);
        }
    }

    async saveBookmarkFileAsync(userId: string, bookmarks: any): Promise<void> {
        const file = this.getBookmarkFilePath(userId);
        const contents = this.serializer.Serialize(bookmarks);
        fs.writeFileSync(file, contents);
    }

    async getAssetAsync(userId: string, assetId: string): Promise<Asset> {
        const file = this.getFilePath(userId, assetId);
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file);
            const parsed =  JSON.parse(content.toString());
            const asset = new Asset(parsed.id, parsed.content, parsed.contentType);
            return asset;
        } else {
            throw(`Asset not found: ${assetId}`);
        } 
    }
    
    async saveAssetAsync(userId: string, asset: Asset): Promise<void> {
        const file = this.getFilePath(userId, asset.id);
        fs.writeFileSync(file, JSON.stringify(asset));
    }
}

export {FsFileProvider}