import {IRoute} from '../IRoute';
import {Request, Response} from 'express';

export abstract class AbstractRoute implements IRoute {

    async perform(req: Request, res: Response): Promise<void> {
        let method = this.getMethod().toLowerCase();

        if (method === "get") {
            console.log(`Performing [${req.method}] '${req.url}' by '${req.ip}'`);
        } else {
            console.log(`Performing [${req.method}] '${req.url}' by '${req.ip}' with request body: ` + JSON.stringify(req.body));
        }

        return await this.performRequest(req, res).then(result => {return result});
    }

    abstract performRequest(req: Request, res: Response): Promise<void>;

    /**
     * The endpoint path name.
     */
    protected abstract path(): string;

    /**
     * Visit {@link IRoute} for more info.
     */
    abstract getMethod(): string;

    /**
     * Visit {@link IRoute} for more info.
     */
    getPath(): string {
        return "/v1" + this.path();
    }
}