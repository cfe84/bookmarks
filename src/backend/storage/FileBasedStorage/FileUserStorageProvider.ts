import {IUserStorageProvider} from "../IUserStorageProvider";
import { IFileProvider } from "./IFileProvider";
import { Asset } from "./Asset";

class FileUserStorageProvider implements IUserStorageProvider{

    constructor(private fileProvider: IFileProvider) {
    }

    USER_STORE_LOOKUP = "userslookup";

    userCache: {[systemUserId: string]: string} = {};
    
    async setUserIdAsync(systemUserId: string, userId: string): Promise<void> {
        this.userCache[systemUserId] = userId;
        let asset = new Asset(systemUserId, userId);
        await this.fileProvider.saveAssetAsync(this.USER_STORE_LOOKUP, asset);
    }

    async getUserIdAsync(systemUserId: string): Promise<string> {
        if (this.userCache[systemUserId] === undefined) {
            const userIdAsset = await this.fileProvider.getAssetAsync(this.USER_STORE_LOOKUP, systemUserId);
            const userId = userIdAsset.content;
            this.userCache[systemUserId] = userId;
            return userId;
        }
        return this.userCache[systemUserId]
    }
}

export { FileUserStorageProvider }
