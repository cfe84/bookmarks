import { ICommand } from "./ICommand";
import { Container } from "../Container";
import { Folder } from "../models";

class MoveSubfolderCommand implements ICommand<void> {
    constructor(private userId: string, 
        private oldFolderId: string, 
        private newFolderId: string, 
        private subFolder: Folder) { }

    async executeAsync(container: Container): Promise<void> {
        const oldFolder = await container.storageProvider.getFolderAsync(this.userId, this.oldFolderId);
        const newFolder = await container.storageProvider.getFolderAsync(this.userId, this.newFolderId);
        await container.storageProvider.saveFolderAsync(this.userId, this.subFolder);
        if (newFolder.folderIds.indexOf(this.subFolder.id) < 0) {
            newFolder.folderIds.push(this.subFolder.id);
            await container.storageProvider.saveFolderAsync(this.userId, newFolder);
        }
        
        const indexOfSubfolderInOldFolder = oldFolder.folderIds.indexOf(this.subFolder.id);
        if (indexOfSubfolderInOldFolder >= 0) {
            oldFolder.folderIds.splice(indexOfSubfolderInOldFolder, 1);
            await container.storageProvider.saveFolderAsync(this.userId, oldFolder);
        }
    }
}

export { MoveSubfolderCommand }