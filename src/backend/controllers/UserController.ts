import { Container } from "../Container";
import { RequestParameters } from "./RequestParameters";
import { mapRoute } from "./utils/mapRoute";
import { AuthenticatedUser } from "../models";

class UserController {
    constructor(private container: Container) {
    }
    
    setRoutes(app: any) {
        const baseRoute = "/api/users";
        app.get(`${baseRoute}/:me`, mapRoute(this.getMe.bind(this)));
    }
    
    async getMe(requestParameters: RequestParameters): Promise<AuthenticatedUser> {
        const user = requestParameters.user;
        return user;
    }

}

export { UserController }