import { Container } from "../Container";
import { IStorageProvider } from "../storage/IStorageProvider";
import { Folder } from "../models/Folder";
import { Bookmark } from "../models/Bookmark";
import { RequestParameters } from "./RequestParameters";
import { mapRoute } from "./utils/mapRoute";
import { SaveBookmarkCommand } from "../commands";

const ROOT_DIRECTORY: string = "root";

class BookmarksController {
    private storageProvider: IStorageProvider;

    constructor(private container: Container) {
        this.storageProvider = container.storageProvider;
    }
    
    setRoutes(app: any) {
        const baseRoute = "/api/bookmarks";
        app.get(`${baseRoute}/:bookmarkId`, mapRoute(this.getBookmark.bind(this)));
        app.put(`${baseRoute}/:bookmarkId`, mapRoute(this.putBookmark.bind(this)));
    }
    
    async getBookmark(requestParameters: RequestParameters): Promise<Bookmark> {
        const userId = requestParameters.headers.userid;
        const bookmarkId = requestParameters.parameters.bookmarkId;
        const bookmark = await this.storageProvider.getBookmarkAsync(userId, bookmarkId)
        return bookmark;
    }

    async putBookmark(requestParameters: RequestParameters): Promise<void> {
        const userId = requestParameters.headers.userid;
        const bookmark: Bookmark = requestParameters.body;
        const command = new SaveBookmarkCommand(userId, bookmark);
        return await command.executeAsync(this.container);
    }
}

export { BookmarksController }