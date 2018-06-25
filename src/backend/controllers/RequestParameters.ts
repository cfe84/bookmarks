class RequestParameters {
    headers: { [headerName: string]: string } = {}
    parameters: { [parameterName: string]: string } = {}
    body: any;
    
    constructor(request: any) {
        this.headers = request.headers || {};
        this.parameters = request.params || {};
        this.body = request.body || null;
    }
}

export { RequestParameters }