import Express from "express";
import "reflect-metadata";
import {BookmarksController} from "./controllers/BookmarksController";
import {FoldersController} from "./controllers/FoldersController";
import expressBody from "body-parser";
import { Container } from "./Container";
import { FileStorageProvider, FsFileProvider, IStorageProvider, AzureBlobStorageFileProvider, IFileProvider } from "./storage";

class App {
    app: any;

    private inject(): Container {
        let storage: IStorageProvider;
        let fileProvider: IFileProvider;
        if (process.env.STORAGE_CONNECTION_STRING !== undefined) {
            fileProvider = new AzureBlobStorageFileProvider(process.env.STORAGE_CONNECTION_STRING);
        } else {
            let dataFolder = process.env.DATA_FOLDER;
            if (dataFolder === undefined) {
                dataFolder = "./data";
                console.warn("DATA_FOLDER not set, defaulting to folder ./data");
            }
            fileProvider = new FsFileProvider(dataFolder);
        }
        return new Container(new FileStorageProvider(fileProvider));
    }

    constructor() {
        const container = this.inject();        
        Container.set(container);

        this.app = Express();
        this.app.use(Express.static("./frontend"));
        this.app.use(expressBody.json());

        const bookmarksController = new BookmarksController(container);
        bookmarksController.setRoutes(this.app);
        const foldersController = new FoldersController(container);
        foldersController.setRoutes(this.app);
    }

    listen(port: number) {
        this.app.listen(port, () => {console.log(`Listening on ${port}`)});
    }
}

export { App }