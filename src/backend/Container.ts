import { IBookmarksStorageProvider } from "./storage";
import { IAuthMiddleware } from "./authentication";

class Container {
    static instance: Container;
    static set(container: Container): void {
        this.instance = container;
    }
    static get(): Container {
        return this.instance
    }

    constructor(
        public storageProvider: IBookmarksStorageProvider,
        public authMiddleware: IAuthMiddleware
    ) { }


    
}

export { Container }