import { IStorageProvider } from "./storage/IStorageProvider";

class Container {
    static instance: Container;
    static set(container: Container): void {
        this.instance = container;
    }
    static get(): Container {
        return this.instance
    }
    constructor(
        public storageProvider: IStorageProvider
    ) { }
    
}

export { Container }