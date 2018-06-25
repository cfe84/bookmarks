import { IFileProvider } from "./IFileProvider";
import fs from "fs";
import path from "path";
import { BookmarkFile } from "./BookmarkFile";
import { JsonSerializer } from ".";

class FsFileProvider implements IFileProvider {
    serializer = new JsonSerializer()
    constructor(private folder: string) {}

    private createFolderIfNotExist(folder: string) {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
    }

    private getUserFolder(userId: string): string {
        this.createFolderIfNotExist(this.folder);
        return path.join(this.folder, userId);
    }
    
    private getBookmarkFilePath(userId: string): string {
        const folder = this.getUserFolder(userId);
        this.createFolderIfNotExist(folder);
        return path.join(folder, `bookmark.json`);
    }

    async getBookmarkFileAsync(userId: string): Promise<any> {
        const file = this.getBookmarkFilePath(userId);
        if (fs.existsSync(file)) {
            const contents = fs.readFileSync(file);
            const bookmarks = this.serializer.Deserialize(contents.toString());
            return bookmarks;
        } else {
            return new BookmarkFile(true);
        }
    }

    async saveBookmarkFileAsync(userId: string, bookmarks: any): Promise<void> {
        const file = this.getBookmarkFilePath(userId);
        const contents = this.serializer.Serialize(bookmarks);
        fs.writeFileSync(file, contents);
    }
}

export {FsFileProvider}