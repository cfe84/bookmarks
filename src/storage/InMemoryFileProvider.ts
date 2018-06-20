import { IFileProvider } from "./IFileProvider";
import { BookmarkFile } from "./BookmarkFile";

class InMemoryFileProvider implements IFileProvider {
    private files: { [userId: string]: BookmarkFile } = {};

    async getBookmarkFileAsync(userId: string): Promise<BookmarkFile> {
        if (!this.files[userId]) {
            this.files[userId] = new BookmarkFile();
        }
        return this.files[userId];
    }
    
    async saveBookmarkFileAsync(userId: string, bookmarks: BookmarkFile): Promise<void> {
        this.files[userId] = bookmarks
    }
}

export {InMemoryFileProvider}