import axios from 'axios';

export enum ResponseType {
    OK = "OK",
    KO = "KO"
}

export type Response<Data extends object> = {
    type: ResponseType,
    message: string,
    data: Data
}

abstract class AbstractRequest<T, ResponseType extends object> {
    readonly method: string;
    readonly url: string;

    protected constructor(method: string, url: string) {
        this.method = method.toLowerCase();
        this.url = url;
    }

    sendRequest(data: T): Promise<Response<ResponseType>> {
        switch (this.method) {
            case "get": return axios.get(this.url,{params: data}).then(response => response.data);
            case "post": return axios.post(this.url,{body: data}).then(response => response.data);
            default: throw new Error(`${this.url} method not implemented`);
        }
    }
}

export default AbstractRequest;