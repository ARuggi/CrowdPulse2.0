import {Response, ResponseType} from '../requests/AbstractRequest'

export async function filterResponse<T extends object>(response: Response<T>): Promise<Response<T>> {

    if (response.type === ResponseType.OK) {
        return response;
    }

    throw new KOResponseError(response);
}

export class KOResponseError extends Error {
    private readonly response;

    constructor(response: Response<any>) {
        super("KO: " + response.message);
        this.response = response;
    }
}