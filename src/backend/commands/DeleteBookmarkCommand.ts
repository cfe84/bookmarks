import { ICommand } from "./ICommand";
import { Container } from "../Container";
import { Bookmark } from "../models";

class DeleteBookmarkCommand implements ICommand<void> {
    constructor(private userId: string, 
        private parentFolderId: string, 
        private bookmark: Bookmark) { }

    async executeAsync(container: Container): Promise<void> {
        const parentFolder = await container.storageProvider.getFolderAsync(this.userId, this.parentFolderId);
        const index = parentFolder.bookmarkIds.indexOf(this.bookmark.id);
        if (index < 0) {
            throw new Error(`Bookmark not found: ${this.bookmark.id}`);
        }
        parentFolder.bookmarkIds.splice(index, 1);
        await container.storageProvider.saveFolderAsync(this.userId, parentFolder);
        await container.storageProvider.deleteBookmarkAsync(this.userId, this.bookmark);
    }
}

export { DeleteBookmarkCommand }