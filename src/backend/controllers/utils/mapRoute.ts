import { RequestParameters } from "../RequestParameters";

const mapRoute = (funcAsync: any, needsAuthentication: boolean = true) => {
    return async (req: any, res: any) => {
        if (needsAuthentication && !req.user) {
            res.statusCode = 401;
            res.json("unauthorized");
            res.end();
        }
        try {
            const result = await funcAsync(new RequestParameters(req));
            res.json(result);
            res.end();
        } catch(error) {
            res.statusCode = 500;
            res.json(error);
            res.end();
        }
    }
}

export { mapRoute }