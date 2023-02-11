import {DatabasesResponse} from "./DatabasesResponse";

async function apiCall<Type> (method: string, url: string, body: any = null): Promise<Type | null> {
    if (url.indexOf('undefined') !== -1 || url.indexOf('null') !== -1) return null

    const options: RequestInit = { method }
    if (body) {
        options.body = JSON.stringify(body)
        options.headers = { 'Content-Type': 'application/json' }
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
    GetDatabases (dbs: string[] | null = null): Promise<DatabasesResponse | null> { return apiCall<DatabasesResponse>("GET", "/v1/databases", dbs) }
}

export default api