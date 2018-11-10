import { AuthenticatedUser, SystemUser } from "../models";

class RequestParameters {
    headers: { [headerName: string]: string } = {}
    parameters: { [parameterName: string]: string } = {}
    queryParameters: { [parameterName: string]: string } = {}
    body: any;
    user: AuthenticatedUser;
    systemUser: SystemUser;
    
    constructor(request: any) {
        this.headers = request.headers || {};
        this.parameters = request.params || {};
        this.body = request.body || request.rawBody || null;
        this.queryParameters = request.query || {};
        this.user = request.user || null;
        this.systemUser = request.systemUser || null;
    }
}

export { RequestParameters }