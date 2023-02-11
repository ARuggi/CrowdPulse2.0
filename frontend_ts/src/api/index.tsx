import {DatabasesResponse} from "./DatabasesResponse";

type BodyGet = {
    key: string,
    value: string
}

async function apiCall<Type> (method: string, url: string, body: any = null): Promise<Type | null> {
    if (url.indexOf('undefined') !== -1 || url.indexOf('null') !== -1) return null

    const options: RequestInit = { method }

    if (body) {
        if (method.toUpperCase() === 'GET') {
            body = body as Array<BodyGet>;
            if (body.length > 0) {
                const searchParams = new URLSearchParams();

                body.forEach((current: BodyGet) => {
                    searchParams.append(current.key, current.value);
                })

                url += '?' + searchParams.toString();
            }
        } else { // For other method requests, set body as json.
            options.body = JSON.stringify(body)
            options.headers = { 'Content-Type': 'application/json' }
        }
    }

    let responseBody
    try {
        const response = await fetch(url, options)
        responseBody = await response.json()
        return responseBody as Type
    } catch (e: any) {
        throw new Error(responseBody || e.toString())
    }
}

const api = {

    /**
     * Gets information about the remote databases of MongoDB.
     * @param dbs Specify a database filter or keep it empty.
     * @constructor
     */
    GetDatabases (dbs: string[] | null = null): Promise<DatabasesResponse | null> {
        let body: Array<BodyGet> | null = null;

        if (dbs && dbs.length > 0)  {
            body = [];
            dbs.forEach((database) => {
                body?.push({key: 'dbs', value: database});
            });
        }

        return apiCall<DatabasesResponse>("GET", "/v1/databases", body);
    }
}

export default api;