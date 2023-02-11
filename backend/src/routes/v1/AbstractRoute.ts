import {IRoute} from '../IRoute';
import {Request, Response} from 'express';

export abstract class AbstractRoute implements IRoute {

    async handleRequest(req: Request, res: Response): Promise<void> {
        let method = this.getMethod().toLowerCase();

        if (method === "get") {
            console.log(`Executing [${req.method}] '${req.url}' by '${req.ip}'`);
        } else {
            console.log(`Executing [${req.method}] '${req.url}' by '${req.ip}' with request body: ` + JSON.stringify(req.body));
        }

        try {
            return await this.handleRouteRequest(req, res);
        } catch (error) {
            console.log(error)
            res.status(500);
            res.send({error: error.message});
        }
    }

    abstract handleRouteRequest(req: Request, res: Response): Promise<void>;

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