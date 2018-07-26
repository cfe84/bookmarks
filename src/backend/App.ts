import Express from "express";
import "reflect-metadata";
import {BookmarksController} from "./controllers/BookmarksController";
import {FoldersController} from "./controllers/FoldersController";
import {UserController} from "./controllers/UserController";
import expressBody from "body-parser";
import path from "path";
import { Container } from "./Container";
import { FileStorageProvider, FsFileProvider, IStorageProvider, AzureBlobStorageFileProvider, IFileProvider } from "./storage";
import { IAuthMiddleware, AzureADAuthMiddleware, FakeAuthMiddleware } from "./authentication";

class App {
    app: any;

    private inject(): Container {
        let storage: IStorageProvider;
        let fileProvider: IFileProvider;
        let authMiddleware: IAuthMiddleware;
        if (process.env.STORAGE_CONNECTION_STRING) {
            fileProvider = new AzureBlobStorageFileProvider(process.env.STORAGE_CONNECTION_STRING);
        } else {
            let dataFolder = process.env.DATA_FOLDER;
            if (dataFolder === undefined) {
                dataFolder = "./data";
                console.warn("DATA_FOLDER not set, defaulting to folder ./data");
            }
            fileProvider = new FsFileProvider(dataFolder);
        }
        if (process.env.WEBSITE_AUTH_DEFAULT_PROVIDER === 'AzureActiveDirectory') {
            authMiddleware = new AzureADAuthMiddleware();
        } else {
            console.warn("Not auth provider configured, using a fake one");
            authMiddleware = new FakeAuthMiddleware();
        }
        return new Container(
            new FileStorageProvider(fileProvider),
            authMiddleware);
    }

    private rawBody(req: any, res: any, next: any) {
        let data = "";
        req.on("data", (chunk: string) => data += chunk);
        req.on("end", () => {
            if (req.headers["content-type"] === "application/json") {
                req.body = JSON.parse(data);
            } else {
                req.rawBody = data;
            }
            next();
        });
    }

    constructor() {
        const container = this.inject();        
        Container.set(container);

        this.app = Express();
        this.app.use(container.authMiddleware.authenticate);
        this.app.use(this.rawBody);
        this.app.use(Express.static(path.join(__dirname, "frontend")));

        const bookmarksController = new BookmarksController(container);
        bookmarksController.setRoutes(this.app);
        const foldersController = new FoldersController(container);
        foldersController.setRoutes(this.app);
        const userController = new UserController(container);
        userController.setRoutes(this.app);
    }

    listen(port: string) {
        this.app.listen(port, () => {console.log(`Listening on ${port}`)});
    }
}

export { App }