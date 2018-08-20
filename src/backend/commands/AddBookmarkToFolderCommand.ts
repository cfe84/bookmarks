import { ICommand } from "./ICommand";
import { Container } from "../Container";
import { Bookmark } from "../models";

class AddBookmarkToFolderCommand implements ICommand<void> {
    constructor(private userId: string, 
        private folderId: string, 
        private bookmark: Bookmark) { }

    async executeAsync(container: Container): Promise<void> {
        const folder = await container.storageProvider.getFolderAsync(this.userId, this.folderId);
        await container.storageProvider.saveBookmarkAsync(this.userId, this.bookmark);
        if (folder.bookmarkIds.indexOf(this.bookmark.id) < 0) {
            folder.bookmarkIds.push(this.bookmark.id);
            await container.storageProvider.saveFolderAsync(this.userId, folder);
        }
    }
}

export { AddBookmarkToFolderCommand }