import {Response, ResponseType} from '../requests/AbstractRequest'

export function performResponse(response: Response<any>,
                                okCallback: (response: Response<any>) => void,
                                koCallback: (response: Response<any>) => void) {

    switch (response?.type) {
        case ResponseType.OK: okCallback(response); break;
        case ResponseType.KO: koCallback(response); break;
        default: throw new Error("Response type doesn't exist");
    }
}