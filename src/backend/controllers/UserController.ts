import { Container } from "../Container";
import { RequestParameters } from "./RequestParameters";
import { mapRoute } from "./utils/mapRoute";
import { AuthenticatedUser, SystemUser } from "../models";

class UserController {
    constructor(private container: Container) {
    }
    
    setRoutes(app: any) {
        const baseRoute = "/api/users";
        app.get(`${baseRoute}/:me`, mapRoute(this.getMe.bind(this), false));
        app.get(`${baseRoute}/:me/systemUser`, mapRoute(this.getSystemUser.bind(this), false));
    }
    
    async getMe(requestParameters: RequestParameters): Promise<AuthenticatedUser> {
        const user = requestParameters.user;
        return user;
    }
    
    async getSystemUser(requestParameters: RequestParameters): Promise<SystemUser> {
        const user = requestParameters.systemUser;
        return user;
    }
}

export { UserController }