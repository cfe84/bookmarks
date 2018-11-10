import { IAuthMiddleware } from "./IAuthMiddleware";
import { AuthenticatedUser, SystemUser } from "../models";
import { IUserStorageProvider } from "../storage";

class AzureADAuthMiddleware implements IAuthMiddleware{

    constructor(private userStorageProvider: IUserStorageProvider) {}

    public authenticate(req: any, res: any, next: any): void {
        const principalId: string = req.headers["x-ms-client-principal-id"];
        const principalName: string = req.headers["x-ms-client-principal-name"];
        const idp: string = req.headers["x-ms-client-principal-idp"];
        const easyAuthHeadersArePresent = principalId && principalName ;
        if ( easyAuthHeadersArePresent ) {
            req.systemUser = new SystemUser();
            req.systemUser.id = principalId;
            req.systemUser.identityProvider = idp;
            req.systemUser.name = principalName;

            this.userStorageProvider.getUserIdAsync(principalId)
                .then((userId) => {
                    req.user = new AuthenticatedUser(
                        userId,
                        principalName);
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