import { ICommand } from "./ICommand";
import { Container } from "../Container";
import { Bookmark } from "../models";

class MoveBookmarkToFolderCommand implements ICommand<void> {
    constructor(private userId: string, 
        private oldFolderId: string, 
        private newFolderId: string,
        private bookmark: Bookmark) { }

    async executeAsync(container: Container): Promise<void> {
        const oldFolder = await container.storageProvider.getFolderAsync(this.userId, this.oldFolderId);
        const newFolder = await container.storageProvider.getFolderAsync(this.userId, this.newFolderId);
        await container.storageProvider.saveBookmarkAsync(this.userId, this.bookmark);
        if (newFolder.bookmarkIds.indexOf(this.bookmark.id) < 0) {
            newFolder.bookmarkIds.push(this.bookmark.id);
            await container.storageProvider.saveFolderAsync(this.userId, newFolder);
        }
        const indexOfBookmarkInOldFolder = oldFolder.bookmarkIds.indexOf(this.bookmark.id);
        if (indexOfBookmarkInOldFolder >= 0) {
            oldFolder.bookmarkIds.splice(indexOfBookmarkInOldFolder, 1);
            await container.storageProvider.saveFolderAsync(this.userId, oldFolder);
        }
    }
}

export { MoveBookmarkToFolderCommand }