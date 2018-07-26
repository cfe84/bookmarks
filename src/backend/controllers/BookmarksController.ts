import { Container } from "../Container";
import { IStorageProvider } from "../storage";
import { Folder, Bookmark, Icon } from "../models";
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
        const getBookmarkIcon: (parameters: RequestParameters) => Promise<Icon> = this.getBookmarkIcon.bind(this);
        const getIcon = async (req: any, res: any) => {
            try {
                const result = await getBookmarkIcon(new RequestParameters(req));
                res.set("content-type", result.contentType);
                res.write(result.content);
                res.end();
            } catch(error) {
                console.error(`Error - ${error.message} \n ${error.stack}`);
                res.statusCode = 500;
                res.json(error);
                res.end();
            }
        }

        const baseRoute = "/api/bookmarks";
        app.get(`${baseRoute}/:bookmarkId`, mapRoute(this.getBookmark.bind(this)));
        app.get(`${baseRoute}/:bookmarkId/icon`, getIcon);
        app.put(`${baseRoute}/:bookmarkId`, mapRoute(this.putBookmark.bind(this)));
    }
    
    async getBookmark(requestParameters: RequestParameters): Promise<Bookmark> {
        const userId = requestParameters.user.id;
        const bookmarkId = requestParameters.parameters.bookmarkId;
        const bookmark = await this.storageProvider.getBookmarkAsync(userId, bookmarkId)
        return bookmark;
    }

    async getBookmarkIcon(requestParameters: RequestParameters): Promise<Icon> {
        const userId = requestParameters.queryParameters.userid;
        const bookmarkId = requestParameters.parameters.bookmarkId;
        const bookmark = await this.storageProvider.getBookmarkAsync(userId, bookmarkId);
        const icon = await this.storageProvider.getIconAsync(userId, bookmark.iconId);
        return icon;
    }

    async putBookmark(requestParameters: RequestParameters): Promise<void> {
        const userId = requestParameters.user.id;
        const bookmark: Bookmark = requestParameters.body;
        const command = new SaveBookmarkCommand(userId, bookmark);
        return await command.executeAsync(this.container);
    }
}

export { BookmarksController }