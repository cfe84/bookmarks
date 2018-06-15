import { ICommand } from "./ICommand";
import { Container } from "../Container";
import { Folder } from "../models/Folder";

class AddSubfolderCommand implements ICommand {
    constructor(private userId: string, 
        private parentFolderId: string, 
        private subFolder: Folder) { }

    async executeAsync(container: Container): Promise<void> {
        const parentFolder = await container.storageProvider.getFolderAsync(this.userId, this.parentFolderId);
        await container.storageProvider.saveFolderAsync(this.userId, this.subFolder);
        if (parentFolder.folderIds.indexOf(this.subFolder.id) < 0) {
            parentFolder.folderIds.push(this.subFolder.id);
            await container.storageProvider.saveFolderAsync(this.userId, parentFolder);
        }
    }
}

export { AddSubfolderCommand }