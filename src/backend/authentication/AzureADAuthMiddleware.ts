import { IAuthMiddleware } from "./IAuthMiddleware";
import { AuthenticatedUser } from "../models";
import { IStorageProvider } from "../storage";

class AzureADAuthMiddleware implements IAuthMiddleware{

    constructor(private storageProvider: IStorageProvider) {}

    public authenticate(req: any, res: any, next: any): void {
        if (!req.headers["x-ms-client-principal-name"] 
            || !req.headers["x-ms-client-principal-id"]) {
                res.statusCode = 401;
                res.json(Error("Authentication headers are missing"));
                res.end();
            }
        else {
            this.storageProvider.getUserIdAsync(req.headers["x-ms-client-principal-id"])
                .then((userId) => {
                    req.user = new AuthenticatedUser(
                        userId,
                        req.headers["x-ms-client-principal-name"]);
                    next();
                })
                .catch((error) => {
                    console.error(error);
                    console.error(`User not found: ${req.headers["x-ms-client-principal-id"]}`);
                    res.statusCode = 403;
                    res.json(Error("User not found"));
                    res.end();  
                    next();
                })
        }
    }
}

export {AzureADAuthMiddleware}