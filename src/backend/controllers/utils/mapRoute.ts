import { RequestParameters } from "../RequestParameters";

const mapRoute = (func: any) => {
    return async (req: any, res: any) => {
        try {
        const result = await func(new RequestParameters(req));
        res.json(result);
        res.end();
        } catch(error) {
            console.error(`Error - ${error.message} \n ${error.stack}`);
            res.statusCode = 500;
            res.json(error);
            res.end();
        }
    }
}

export { mapRoute }