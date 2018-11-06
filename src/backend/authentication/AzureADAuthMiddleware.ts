import { IAuthMiddleware } from "./IAuthMiddleware";
import { AuthenticatedUser } from "../models";
import { IUserStorageProvider } from "../storage";

class AzureADAuthMiddleware implements IAuthMiddleware{

    constructor(private userStorageProvider: IUserStorageProvider) {}

    public authenticate(req: any, res: any, next: any): void {
        const easyAuthHeadersArePresent = req.headers["x-ms-client-principal-name"]
            && req.headers["x-ms-client-principal-id"] ;
        if ( easyAuthHeadersArePresent ) {
            this.userStorageProvider.getUserIdAsync(req.headers["x-ms-client-principal-id"])
                .then((userId) => {
                    req.user = new AuthenticatedUser(
                        userId,
                        req.headers["x-ms-client-principal-name"]);
                    next();
                })
                .catch((error) => { 
                    next();
                })
        }
        else {
            next();
        }
    }
}

export {AzureADAuthMiddleware}