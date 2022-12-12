import axios from 'axios';

export enum ResponseType {
    OK = "OK",
    KO = "KO"
}

export type Response<D extends object> = {
    type: ResponseType,
    message: string,
    data: D
}

abstract class AbstractRequest<T, ResponseType> {
    readonly method: string;
    readonly url: string;

    protected constructor(method: string, url: string) {
        this.method = method.toLowerCase();
        this.url = url;
    }

    sendRequest(data: T): Promise<ResponseType> {
        switch (this.method) {
            case "get": return this.sendGetRequest(data);
            case "post": return this.sendPostRequest(data);
            default: throw new Error(`${this.url} method not implemented`);
        }
    }

    private sendGetRequest(data: T): Promise<ResponseType> {
        return axios.get(this.url,{params: data});
    }

    private sendPostRequest(data: T): Promise<ResponseType> {
        return axios.post(this.url,{params: data});
    }
}

export default AbstractRequest;