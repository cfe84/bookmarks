import { IStorageProvider } from "./IStorageProvider";
import { IStorageTransaction } from "./IStorageTransaction";
import { IItem } from "../models/IItem";
import { Folder, Bookmark, Icon } from "../models";
import { IFileProvider } from "./IFileProvider";
import { BookmarkFile } from "./BookmarkFile";
import { Asset } from ".";

class FileStorageProvider implements IStorageProvider, IStorageTransaction {
    cache: {[userId: string]: BookmarkFile} = {};

    async commitAsync(): Promise<void> {
        for (let userId in this.cache) {
            await this.fileProvider.saveBookmarkFileAsync(userId, this.cache[userId]);
        }
        this.cache = {};
    }

    async beginTransactionAsync(): Promise<IStorageTransaction> {
        const txn = new FileStorageProvider(this.fileProvider, true);
        return txn;
    }

    private async getUserFile(userId: string) : Promise<BookmarkFile> {
        if (this.transaction) {
            if (!this.cache[userId]) {
                this.cache[userId] = await this.fileProvider.getBookmarkFileAsync(userId);
            }
            return this.cache[userId];
        } else {
            return await this.fileProvider.getBookmarkFileAsync(userId);
        }
    }

    private async saveUserFile(userId: string, file: BookmarkFile): Promise<void> {
        if (this.transaction) {
            this.cache[userId] = file;
        } else {
            await this.fileProvider.saveBookmarkFileAsync(userId, file);
        }
    }

    async getFolderAsync(userId: string, folderId: string): Promise<Folder> {
        const file = await this.getUserFile(userId);
        return this.getFolderInFile(file, userId, folderId);
    }

    private getFolderInFile(file: BookmarkFile, userId: string, folderId: string) : Folder {
        const folder:Folder = file.folders[folderId];
        if (!folder) {
            throw Error("Folder not found");
        }
        const result = Object.assign(new Folder(), folder);
        return result;
    }

    async getBookmarkAsync(userId: string, bookmarkId: string): Promise<Bookmark> {
        const file = await this.getUserFile(userId);
        return this.getBookmarkInFile(file, userId, bookmarkId);
    }

    private getBookmarkInFile(file: BookmarkFile, userId: string, bookmarkId: string): Bookmark {
        const bookmark:Bookmark = file.bookmarks[bookmarkId];
        if (!bookmark) {
            throw Error("Bookmark not found");
        }
        const result: Bookmark = Object.assign(new Bookmark(), bookmark);
        return result;
    }

    async getSubfoldersAsync(userId: string, folderId: string): Promise<Folder[]> {
        const file = await this.getUserFile(userId);
        const folder = file.folders[folderId];
        Object.setPrototypeOf(folder, Folder);
        const result: Array<Folder> = [];
        for(const folderId of folder.folderIds) {
            result.push(this.getFolderInFile(file, userId, folderId));
        }
        return result;
    }
    async getBookmarksAsync(userId: string, folderId: string): Promise<Bookmark[]> {
        const file = await this.getUserFile(userId);
        const folder = file.folders[folderId];
        Object.setPrototypeOf(folder, Folder);
        const result: Array<Bookmark> = [];
        for(const bookmarkId of folder.bookmarkIds) {
            result.push(this.getBookmarkInFile(file, userId, bookmarkId));
        }
        return result;
    }
    async saveFolderAsync(userId: string, folder: Folder): Promise<void> {
        const file = await this.getUserFile(userId);
        file.folders[folder.id] = folder;
        await this.saveUserFile(userId, file);
    }

    async saveBookmarkAsync(userId: string, bookmark: Bookmark): Promise<void> {
        const file = await this.getUserFile(userId);
        file.bookmarks[bookmark.id] = bookmark;
        await this.saveUserFile(userId, file);
    }
    
    async deleteFolderAsync(userId: string, folder: Folder): Promise<void> {
        const file = await this.getUserFile(userId);
        delete file.folders[folder.id];
        await this.saveUserFile(userId, file);
    }
    async deleteBookmarkAsync(userId: string, bookmark: Bookmark): Promise<void> {
        const file = await this.getUserFile(userId);
        delete file.bookmarks[bookmark.id];
        await this.saveUserFile(userId, file); 
    }

    private getIconName(iconId: string): string {
        return `icon-${iconId}`;
    }

    async getIconAsync(userId: string, iconId: string): Promise<Icon> {
        const asset = await this.fileProvider.getAssetAsync(userId, this.getIconName(iconId));
        const icon = new Icon(asset.content, asset.contentType, iconId);
        return icon;
    }

    async saveIconAsync(userId: string, icon: Icon): Promise<void> {
        const asset = new Asset(this.getIconName(icon.id), icon.content, icon.contentType);
        await this.fileProvider.saveAssetAsync(userId, asset);
    }

    constructor(
        private fileProvider: IFileProvider, 
        private transaction: boolean = false) {

    }
}

export { FileStorageProvider }