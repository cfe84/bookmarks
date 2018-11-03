import { IAuthMiddleware } from "./IAuthMiddleware";
import { AuthenticatedUser } from "../models";

class FakeAuthMiddleware implements IAuthMiddleware{
    authenticate(req: any, res: any, next: any): void {
        let user: AuthenticatedUser | null;
        if (req.headers && req.headers.anonymous === "true") {
            user = null;
        } else {
            user = new AuthenticatedUser("fake-user", "Fake User");
        }
        req.user = user;
        next();
    }
}

export { FakeAuthMiddleware }