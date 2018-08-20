import { ICommand } from "./ICommand"
import { Container } from "../Container";
import { HtmlFileLexer, HtmlFileParser } from "../parser/htmlFile";

class ImportHtmlFileCommand implements ICommand<void> {
    constructor(private userId: string, private folderId:string, private fileContent: string, private importIcons: boolean = false){
        
    }
    
    async executeAsync(container: Container): Promise<void> {
        const lexer = new HtmlFileLexer();
        const tokens = lexer.GetTokens(this.fileContent);
        const parser = new HtmlFileParser(tokens);

        const bookmarkCollection = parser.parse();
        const transaction = await container.storageProvider.beginTransactionAsync();
        const folder = await transaction.getFolderAsync(this.userId, this.folderId);

        for(const folder of bookmarkCollection.folders) {
            await transaction.saveFolderAsync(
                this.userId, 
                folder);
        }

        for(const bookmark of bookmarkCollection.bookmarks) {
            await transaction.saveBookmarkAsync(
                this.userId, 
                bookmark);
        }

        if (this.importIcons) {
            for (const icon of bookmarkCollection.icons) {
                await container.storageProvider.saveIconAsync(this.userId, icon);
            }
        }

        folder.bookmarkIds = folder.bookmarkIds.concat(bookmarkCollection.rootFolder.bookmarkIds);
        folder.folderIds = folder.folderIds.concat(bookmarkCollection.rootFolder.folderIds);
        await transaction.saveFolderAsync(this.userId, folder);
        await transaction.commitAsync();
    }
}

export { ImportHtmlFileCommand }