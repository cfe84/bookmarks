import { ICommand } from "./ICommand"
import { Container } from "../Container";

class ImportHtmlFileCommand implements ICommand {
    constructor(private userId: string, private folderId:string, private fileContent: string){}
    
    async executeAsync(container: Container): Promise<void> {
        
    }
}

export { ImportHtmlFileCommand }