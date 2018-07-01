import { ICommand } from "./ICommand"
import { Container } from "../Container";
import { HtmlFileLexer, HtmlFileParser } from "../parser/htmlFile";

class ImportHtmlFileCommand implements ICommand {
    constructor(private userId: string, private folderId:string, private fileContent: string){
        
    }
    
    async executeAsync(container: Container): Promise<void> {
        const lexer = new HtmlFileLexer();
        const tokens = lexer.GetTokens(this.fileContent);
        const parser = new HtmlFileParser(tokens);

        const parsedFile = parser.parse();
        const transaction = await container.storageProvider.beginTransactionAsync();
        const folder = await transaction.getFolderAsync(this.userId, this.folderId);

        for(const folderId in parsedFile.folders) {
            if (folderId !== "root") {
                await transaction.saveFolderAsync(
                    this.userId, 
                    parsedFile.folders[folderId]);
            }
        }

        for(const bookmarkId in parsedFile.bookmarks) {
            await transaction.saveBookmarkAsync(
                this.userId, 
                parsedFile.bookmarks[bookmarkId]);
        }

        folder.bookmarkIds = folder.bookmarkIds.concat(parsedFile.folders.root.bookmarkIds);
        folder.folderIds = folder.folderIds.concat(parsedFile.folders.root.folderIds);
        await transaction.saveFolderAsync(this.userId, folder);
        await transaction.commitAsync();
    }
}

export { ImportHtmlFileCommand }