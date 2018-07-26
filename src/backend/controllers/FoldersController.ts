import { Container } from "../Container";
import { IStorageProvider } from "../storage";
import { Folder, Bookmark } from "../models";
import { RequestParameters } from "./RequestParameters";
import { mapRoute } from "./utils/mapRoute";
import { AddBookmarkToFolderCommand, AddSubfolderCommand, DeleteSubfolderCommand } from "../commands";
import { ImportHtmlFileCommand } from "../commands/ImportHtmlFileCommand";
const uuid = require("uuid/v4");

const ROOT_DIRECTORY: string = "root";

class FoldersController {
    private storageProvider: IStorageProvider;

    constructor(private container: Container) {
        this.storageProvider = container.storageProvider;
    }
    
    setRoutes(app: any) {
        const baseRoute = "/api/folders";
        app.get(`${baseRoute}/`, mapRoute(this.getRoot.bind(this)));
        app.put(`${baseRoute}/`, mapRoute(this.putFolder.bind(this)));
        app.get(`${baseRoute}/:folderId`, mapRoute(this.getFolder.bind(this)));
        app.post(`${baseRoute}/:folderId`, mapRoute(this.postToFolder.bind(this)));
        app.get(`${baseRoute}/:folderId/bookmarks`, mapRoute(this.getBookmarks.bind(this)));
        app.post(`${baseRoute}/:folderId/bookmarks`, mapRoute(this.postBookmark.bind(this)));
        app.get(`${baseRoute}/:folderId/folders`, mapRoute(this.getSubfolders.bind(this)));
        app.post(`${baseRoute}/:folderId/folders`, mapRoute(this.postSubfolder.bind(this)));
    }
       
    async getRoot(requestParameters: RequestParameters): Promise<Folder> {
        requestParameters.parameters.folderId = ROOT_DIRECTORY;
        return await this.getFolder(requestParameters);
    }

    async putFolder(requestParameters: RequestParameters): Promise<void> {
        const userId = requestParameters.user.id;
        const folder: Folder = requestParameters.body;
        const folderId = requestParameters.parameters.folderId;
        if (folderId) {
            folder.id = folderId;
        }
        await this.storageProvider.saveFolderAsync(userId, folder);
    }

    async getFolder(requestParameters: RequestParameters): Promise<Folder> {
        const userId = requestParameters.user.id;
        const folderId = requestParameters.parameters.folderId;
        const folder = await this.storageProvider.getFolderAsync(userId, folderId);
        if (folder === null && folderId === ROOT_DIRECTORY) {
            const root = new Folder("Home");
            root.id = ROOT_DIRECTORY;
            return root;
        }
        return folder;
    }
    
    async getBookmarks(requestParameters: RequestParameters): Promise<Bookmark[]> {
        const userId = requestParameters.user.id;
        const folderId = requestParameters.parameters.folderId;
        const bookmarks = await this.storageProvider.getBookmarksAsync(userId, folderId);
        return bookmarks;
    }

    async postBookmark(requestParameters: RequestParameters): Promise<void> {
        const userId = requestParameters.user.id;
        const folderId = requestParameters.parameters.folderId;
        const bookmark: Bookmark = Object.assign(new Bookmark(), requestParameters.body);
        const command = new AddBookmarkToFolderCommand(userId, folderId, bookmark);
        await command.executeAsync(this.container);
    }

    async getSubfolders(requestParameters: RequestParameters): Promise<Folder[]> {
        const userId = requestParameters.user.id;
        const folderId = requestParameters.parameters.folderId;
        const subfolders = await this.storageProvider.getSubfoldersAsync(userId, folderId);
        return subfolders.sort((a, b) => a.name.localeCompare(b.name));
    }

    async postSubfolder(requestParameters: RequestParameters): Promise<void> {
        const userId = requestParameters.user.id;
        const folderId = requestParameters.parameters.folderId;
        const folder: Folder = requestParameters.body;
        if (!folder.id) {
            folder.id = uuid();
        }
        const command = new AddSubfolderCommand(userId, folderId, folder);
        await command.executeAsync(this.container);
    }

    async postToFolder(requestParameters: RequestParameters): Promise<void> {
        if (requestParameters.headers["content-type"] === "text/html") {
            const userId = requestParameters.user.id;
            const folderId = requestParameters.parameters.folderId;
            const fileContent: string = requestParameters.body;
            const command = new ImportHtmlFileCommand(userId, folderId, fileContent);
            await command.executeAsync(this.container);
        } else {
            throw Error("This should be a 400");
        }
    }

    async deleteSubfolder(requestParameters: RequestParameters): Promise<void> {
        const userId = requestParameters.user.id;
        const folderId = requestParameters.parameters.folderId;
        const subFolder: Folder = requestParameters.body;
        const command = new DeleteSubfolderCommand(userId, folderId, subFolder);
        await command.executeAsync(this.container)
    }
}

export { FoldersController }