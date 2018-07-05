import { Folder, Bookmark } from "../models";
import { Icon } from ".";

interface IStorageOperations {
    getSubfoldersAsync(userId: string, folderId: string): Promise<Array<Folder>>;
    getBookmarksAsync(userId: string, folderId: string): Promise<Array<Bookmark>>;
    getFolderAsync(userId: string, folderId: string): Promise<Folder>;
    getBookmarkAsync(userId: string, bookmarkId: string): Promise<Bookmark>;
    getIconAsync(userId: string, iconId: string): Promise<Icon>;
    saveFolderAsync(userId: string, folder: Folder): Promise<void>;
    saveBookmarkAsync(userId: string, bookmark: Bookmark): Promise<void>;
    saveIconAsync(userId: string, icon: Icon): Promise<void>;
    deleteFolderAsync(userId: string, folder: Folder): Promise<void>;
    deleteBookmarkAsync(userId: string, bookmark: Bookmark): Promise<void>;
}

export { IStorageOperations }