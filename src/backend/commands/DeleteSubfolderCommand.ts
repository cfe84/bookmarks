import { ICommand } from "./ICommand";
import { Container } from "../Container";
import { Folder } from "../models";

class DeleteSubfolderCommand implements ICommand {
    constructor(private userId: string, 
        private parentFolderId: string, 
        private subFolder: Folder) { }

    async executeAsync(container: Container): Promise<void> {
        const parentFolder = await container.storageProvider.getFolderAsync(this.userId, this.parentFolderId);
        const index = parentFolder.folderIds.indexOf(this.subFolder.id);
        if (index < 0) {
            throw new Error(`Subfolder not found: ${this.subFolder.id}`);
        }
        parentFolder.folderIds.splice(index, 1);
        await container.storageProvider.saveFolderAsync(this.userId, parentFolder);
        await container.storageProvider.deleteFolderAsync(this.userId, this.subFolder);
    }
}

export { DeleteSubfolderCommand }