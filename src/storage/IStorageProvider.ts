import {IItem} from "../models/IItem";
import { Folder } from "../models/Folder";
import { Bookmark } from "../models/Bookmark";

interface IStorageProvider {
    getSubfoldersAsync(userId: string, folderId: string): Promise<Array<Folder>>;
    getBookmarksAsync(userId: string, folderId: string): Promise<Array<Bookmark>>;
    getFolderAsync(userId: string, folderId: string): Promise<Folder>;
    getBookmarkAsync(userId: string, bookmarkId: string): Promise<Bookmark>;
    saveFolderAsync(userId: string, folder: Folder): Promise<void>;
    saveBookmarkAsync(userId: string, bookmark: Bookmark): Promise<void>;
    deleteFolderAsync(userId: string, folder: Folder): Promise<void>;
    deleteBookmarkAsync(userId: string, bookmark: Bookmark): Promise<void>;
}

export { IStorageProvider }