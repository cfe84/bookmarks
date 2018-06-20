import { Container } from "../Container";
import { IStorageProvider } from "../storage/IStorageProvider";
import { Folder } from "../models/Folder";
import { RequestParameters } from "./RequestParameters";
import { mapRoute } from "./utils/mapRoute";
import { Bookmark } from "../models/Bookmark";
import { AddBookmarkToFolderCommand, AddSubfolderCommand } from "../commands";

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
        app.get(`${baseRoute}/:folderId/bookmarks`, mapRoute(this.getBookmarks.bind(this)));
        app.put(`${baseRoute}/:folderId/bookmarks`, mapRoute(this.putBookmark.bind(this)));
        app.get(`${baseRoute}/:folderId/folders`, mapRoute(this.getSubfolders.bind(this)));
        app.put(`${baseRoute}/:folderId/folders`, mapRoute(this.putSubfolder.bind(this)));
    }
       
    async getRoot(requestParameters: RequestParameters): Promise<Folder> {
        requestParameters.parameters.folderId = ROOT_DIRECTORY;
        return await this.getFolder(requestParameters);
    }

    async putFolder(requestParameters: RequestParameters): Promise<void> {
        const userId = requestParameters.headers.userid;
        const folder: Folder = requestParameters.body;
        const folderId = requestParameters.parameters.folderId;
        if (folderId) {
            folder.id = folderId;
        }
        await this.storageProvider.saveFolderAsync(userId, folder);
    }

    async getFolder(requestParameters: RequestParameters): Promise<Folder> {
        const userId = requestParameters.headers.userid;
        const folderId = requestParameters.parameters.folderId;
        const folder = await this.storageProvider.getFolderAsync(userId, folderId);
        return folder;
    }
    
    async getBookmarks(requestParameters: RequestParameters): Promise<Bookmark[]> {
        const userId = requestParameters.headers.userid;
        const folderId = requestParameters.parameters.folderId;
        const bookmarks = await this.storageProvider.getBookmarksAsync(userId, folderId);
        return bookmarks;
    }

    async putBookmark(requestParameters: RequestParameters): Promise<void> {
        const userId = requestParameters.headers.userid;
        const folderId = requestParameters.parameters.folderId;
        const bookmark: Bookmark = Object.assign(new Bookmark(), requestParameters.body);
        const command = new AddBookmarkToFolderCommand(userId, folderId, bookmark);
        await command.executeAsync(this.container);
    }

    async getSubfolders(requestParameters: RequestParameters): Promise<Folder[]> {
        const userId = requestParameters.headers.userid;
        const folderId = requestParameters.parameters.folderId;
        const subfolders = await this.storageProvider.getSubfoldersAsync(userId, folderId);
        return subfolders;
    }

    async putSubfolder(requestParameters: RequestParameters): Promise<void> {
        const userId = requestParameters.headers.userid;
        const folderId = requestParameters.parameters.folderId;
        const folder: Folder = requestParameters.body;
        const command = new AddSubfolderCommand(userId, folderId, folder);
        await command.executeAsync(this.container);
    }
}

export { FoldersController }