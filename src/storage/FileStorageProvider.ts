import { IStorageProvider } from "./IStorageProvider";
import { IItem } from "../models/IItem";
import fs from "fs";
import path from "path";
import { Folder } from "../models/Folder";
import { Bookmark } from "../models/Bookmark";

const rootNodeId: string = "root";

class BookmarkFile {
    public bookmarks: { [bookmarkId: string]: Bookmark } = {}
    public folders: { [folderId: string]: Folder } = {}
    constructor(initialize = false) {
        if (initialize) {
            const folder = new Folder();
            folder.id = rootNodeId;
            this.folders[rootNodeId] = folder;
        }
    }
}

class FileStorageProvider implements IStorageProvider {
    async getFolderAsync(userId: string, folderId: string): Promise<Folder> {
        const file = this.getBookmarkFile(userId);
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
        const file = this.getBookmarkFile(userId);
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
        const file = this.getBookmarkFile(userId);
        const folder = file.folders[folderId];
        Object.setPrototypeOf(folder, Folder);
        const result: Array<Folder> = [];
        for(const folderId of folder.folderIds) {
            result.push(this.getFolderInFile(file, userId, folderId));
        }
        return result;
    }
    async getBookmarksAsync(userId: string, folderId: string): Promise<Bookmark[]> {
        const file = this.getBookmarkFile(userId);
        const folder = file.folders[folderId];
        Object.setPrototypeOf(folder, Folder);
        const result: Array<Bookmark> = [];
        for(const bookmarkId of folder.bookmarkIds) {
            result.push(this.getBookmarkInFile(file, userId, bookmarkId));
        }
        return result;
    }
    async saveFolderAsync(userId: string, folder: Folder): Promise<void> {
        const file = this.getBookmarkFile(userId);
        file.folders[folder.id] = folder;
        this.saveBookmarkFile(userId, file);
    }
    async saveBookmarkAsync(userId: string, bookmark: Bookmark): Promise<void> {
        const file = this.getBookmarkFile(userId);
        file.bookmarks[bookmark.id] = bookmark;
        this.saveBookmarkFile(userId, file);
    }
    
    async deleteFolderAsync(userId: string, folder: Folder): Promise<void> {
        const file = this.getBookmarkFile(userId);
        delete file.folders[folder.id];
        this.saveBookmarkFile(userId, file);
    }
    async deleteBookmarkAsync(userId: string, bookmark: Bookmark): Promise<void> {
        const file = this.getBookmarkFile(userId);
        delete file.bookmarks[bookmark.id];
        this.saveBookmarkFile(userId, file); 
    }
    
    private createFolderIfNotExistAsync(folder: string) {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
    }

    private getUserFolder(userId: string): string {
        this.createFolderIfNotExistAsync(this.folder);
        return path.join(this.folder, userId);
    }

    private getBookmarkFilePath(userId:string): string{ 
        const folder = this.getUserFolder(userId);
        this.createFolderIfNotExistAsync(folder);
        return path.join(folder, `bookmark.json`);
    }

    private getBookmarkFile(userId: string): BookmarkFile {
        const file = this.getBookmarkFilePath(userId);
        if (fs.existsSync(file)) {
            const contents = fs.readFileSync(file);
            const bookmarks = JSON.parse(contents.toString());
            Object.setPrototypeOf(bookmarks, BookmarkFile);
            return bookmarks;
        } else {
            return new BookmarkFile(true);
        }
    }

    private saveBookmarkFile(userId: string, bookmarks: BookmarkFile) {
        const file = this.getBookmarkFilePath(userId);
        const contents = JSON.stringify(bookmarks, null, 2);
        fs.writeFileSync(file, contents);
    }

    constructor(private folder: string) {

    }
}

export { FileStorageProvider }