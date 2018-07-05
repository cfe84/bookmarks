import { BookmarkFile } from "./BookmarkFile";
import { Asset } from ".";

interface IFileProvider {
    getBookmarkFileAsync(userId: string): Promise<BookmarkFile>;
    saveBookmarkFileAsync(userId: string, bookmarks: BookmarkFile): Promise<void>;
    getAssetAsync(userId: string, assetId: string): Promise<Asset>;
    saveAssetAsync(userId: string, asset: Asset): Promise<void>;
}

export {
    IFileProvider
}