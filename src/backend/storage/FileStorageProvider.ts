import { IStorageProvider } from "./IStorageProvider";
import { IItem } from "../models/IItem";
import { Folder, Bookmark } from "../models";
import { IFileProvider } from "./IFileProvider";
import { BookmarkFile } from "./BookmarkFile";

class FileStorageProvider implements IStorageProvider {
    async getFolderAsync(userId: string, folderId: string): Promise<Folder> {
        const file = await this.fileProvider.getBookmarkFileAsync(userId);
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
        const file = await this.fileProvider.getBookmarkFileAsync(userId);
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
        const file = await this.fileProvider.getBookmarkFileAsync(userId);
        const folder = file.folders[folderId];
        Object.setPrototypeOf(folder, Folder);
        const result: Array<Folder> = [];
        for(const folderId of folder.folderIds) {
            result.push(this.getFolderInFile(file, userId, folderId));
        }
        return result;
    }
    async getBookmarksAsync(userId: string, folderId: string): Promise<Bookmark[]> {
        const file = await this.fileProvider.getBookmarkFileAsync(userId);
        const folder = file.folders[folderId];
        Object.setPrototypeOf(folder, Folder);
        const result: Array<Bookmark> = [];
        for(const bookmarkId of folder.bookmarkIds) {
            result.push(this.getBookmarkInFile(file, userId, bookmarkId));
        }
        return result;
    }
    async saveFolderAsync(userId: string, folder: Folder): Promise<void> {
        const file = await this.fileProvider.getBookmarkFileAsync(userId);
        file.folders[folder.id] = folder;
        await this.fileProvider.saveBookmarkFileAsync(userId, file);
    }
    async saveBookmarkAsync(userId: string, bookmark: Bookmark): Promise<void> {
        const file = await this.fileProvider.getBookmarkFileAsync(userId);
        file.bookmarks[bookmark.id] = bookmark;
        await this.fileProvider.saveBookmarkFileAsync(userId, file);
    }
    
    async deleteFolderAsync(userId: string, folder: Folder): Promise<void> {
        const file = await this.fileProvider.getBookmarkFileAsync(userId);
        delete file.folders[folder.id];
        await this.fileProvider.saveBookmarkFileAsync(userId, file);
    }
    async deleteBookmarkAsync(userId: string, bookmark: Bookmark): Promise<void> {
        const file = await this.fileProvider.getBookmarkFileAsync(userId);
        delete file.bookmarks[bookmark.id];
        await this.fileProvider.saveBookmarkFileAsync(userId, file); 
    }

    constructor(private fileProvider: IFileProvider) {

    }
}

export { FileStorageProvider }