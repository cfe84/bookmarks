import { RequestParameters } from "../RequestParameters";

const mapRoute = (func: any) => {
    return async (req: any, res: any) => {
        const result = await func(new RequestParameters(req));
        res.json(result);
        res.end();
    }
}

export { mapRoute }