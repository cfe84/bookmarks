import { BookmarkFile } from "./BookmarkFile";

interface IFileProvider {
    getBookmarkFileAsync(userId: string): Promise<BookmarkFile>;
    saveBookmarkFileAsync(userId: string, bookmarks: BookmarkFile): Promise<void>;
}

export {
    IFileProvider
}