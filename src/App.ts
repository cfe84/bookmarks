import "reflect-metadata";
import {createExpressServer} from "routing-controllers";
import {BookmarksController} from "./controllers/BookmarksController";
import expressBody from "body-parser";

class App {
    app: any;
    constructor() {
        this.app = createExpressServer({
            routePrefix: "/api",
            controllers: [
                BookmarksController
            ]
        });
        this.app.use(expressBody.json);
    }

    listen(port: number) {
        this.app.listen(port);
    }
}

export { App }