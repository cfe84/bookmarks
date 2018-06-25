import { IStorageProvider } from "./IStorageProvider";
import { Folder } from "../models/Folder";
import { Bookmark } from "../models/Bookmark";

class NttStorageProvider implements IStorageProvider {

    

    getSubfoldersAsync(userId: string, folderId: string): Promise<Folder[]> {
        throw new Error("Method not implemented.");
    }
    getBookmarksAsync(userId: string, folderId: string): Promise<Bookmark[]> {
        throw new Error("Method not implemented.");
    }
    getFolderAsync(userId: string, folderId: string): Promise<Folder> {
        throw new Error("Method not implemented.");
    }
    getBookmarkAsync(userId: string, bookmarkId: string): Promise<Bookmark> {
        throw new Error("Method not implemented.");
    }
    saveFolderAsync(userId: string, folder: Folder): Promise<void> {
        throw new Error("Method not implemented.");
    }
    saveBookmarkAsync(userId: string, bookmark: Bookmark): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteFolderAsync(userId: string, folder: Folder): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteBookmarkAsync(userId: string, bookmark: Bookmark): Promise<void> {
        throw new Error("Method not implemented.");
    }

    
}