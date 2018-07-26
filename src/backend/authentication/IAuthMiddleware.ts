interface IAuthMiddleware {
    authenticate(req: any, res: any, next: any): void;
}

export { IAuthMiddleware };