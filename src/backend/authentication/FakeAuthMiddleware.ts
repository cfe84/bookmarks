import { IAuthMiddleware } from "./IAuthMiddleware";
import { AuthenticatedUser, SystemUser } from "../models";

class FakeAuthMiddleware implements IAuthMiddleware{
    authenticate(req: any, res: any, next: any): void {
        let user: AuthenticatedUser | null = null;
        let systemUser: SystemUser | null = null;
        if (!req.headers || req.headers.authenticated !== "true") {
            systemUser = new SystemUser();
            systemUser.authenticated = true;
            systemUser.id = "fake-system-user";
            systemUser.identityProvider = "fake";
            systemUser.issuer = "fakeIss";
            systemUser.name = "Fake User";
        }
        if (!req.headers || req.headers.anonymous !== "true") {
            user = new AuthenticatedUser("fake-user", "Fake User");
        }
        req.systemUser = systemUser;
        req.user = user;
        next();
    }
}

export { FakeAuthMiddleware }