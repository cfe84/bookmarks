import { IAuthMiddleware } from "./IAuthMiddleware";
import { AuthenticatedUser } from "../models";

class AzureADAuthMiddleware implements IAuthMiddleware{
    authenticate(req: any, res: any, next: any): void {
        if (!req.headers["x-ms-client-principal-name"] 
            || !req.headers["x-ms-client-principal-id"]) {
                res.statusCode = 401;
                res.json(Error("Authentication headers are missing"));
                res.end();
            }
        else {
            req.user = new AuthenticatedUser(
                req.headers["x-ms-client-principal-id"],
                req.headers["x-ms-client-principal-name"]);
            next();
        }
    }
}

export {AzureADAuthMiddleware}