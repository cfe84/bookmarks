import { ICommand } from "./ICommand";
import { Container } from "../Container";
import { Bookmark } from "../models";

class SaveBookmarkCommand implements ICommand<void> {
    constructor(private userId: string, 
        private bookmark: Bookmark) { }

    async executeAsync(container: Container): Promise<void> {
        await container.storageProvider.saveBookmarkAsync(this.userId, this.bookmark);
    }
}

export { SaveBookmarkCommand }