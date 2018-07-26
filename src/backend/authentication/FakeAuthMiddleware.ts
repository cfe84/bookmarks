import { IAuthMiddleware } from "./IAuthMiddleware";
import { AuthenticatedUser } from "../models";

class FakeAuthMiddleware implements IAuthMiddleware{
    authenticate(req: any, res: any, next: any): void {
        req.user = new AuthenticatedUser("fake-user", "Fake User");
        next();
    }
}

export { FakeAuthMiddleware }