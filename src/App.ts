import Express from "express";
import "reflect-metadata";
import {BookmarksController} from "./controllers/BookmarksController";
import {FoldersController} from "./controllers/FoldersController";
import expressBody from "body-parser";
import { Container } from "./Container";
import { FileStorageProvider } from "./storage/FileStorageProvider";
import { IStorageProvider } from "./storage/IStorageProvider";

class App {
    app: any;
    constructor() {
        const storage = new FileStorageProvider("data");
        const container = new Container(storage);
        
        Container.set(container);

        this.app = Express();
        this.app.use(Express.static("./static"));
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