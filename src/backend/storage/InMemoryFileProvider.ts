import { IFileProvider } from "./IFileProvider";
import { BookmarkFile } from "./BookmarkFile";
import { Asset } from ".";

class InMemoryFileProvider implements IFileProvider {
    private files: { [userId: string]: {[fileName:string]: string}} = {};

    private getUserFiles(userId: string): {[fileName: string] : string} {
        if (!this.files[userId]) {
            this.files[userId] = {};
        }
        return this.files[userId];
    }

    async getBookmarkFileAsync(userId: string): Promise<BookmarkFile> {
        const files = this.getUserFiles(userId);
        if (!files.bookmarks) {
            files.bookmarks = JSON.stringify(new BookmarkFile(true));
        }
        return JSON.parse(files.bookmarks);
    }
    
    async saveBookmarkFileAsync(userId: string, bookmarks: BookmarkFile): Promise<void> {
        const files = this.getUserFiles(userId);
        files.bookmarks = JSON.stringify(bookmarks);
    }

    async getAssetAsync(userId: string, assetId: string): Promise<Asset> {
        const files = this.getUserFiles(userId);
        return JSON.parse(files[assetId]);
    }

    async saveAssetAsync(userId: string, asset: Asset): Promise<void> {
        const files = this.getUserFiles(userId);
        files[asset.id] = JSON.stringify(asset);
    }
    
}

export {InMemoryFileProvider}