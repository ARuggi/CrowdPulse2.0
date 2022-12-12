import AbstractRequest, {Response} from "../AbstractRequest";

export type TweetDatabasesData = {
    databases: Array<{
        name: string,
        sizeOnDisk: string,
        empty: boolean}>
}

class TweetDatabasesRequest extends AbstractRequest<{}, Response<TweetDatabasesData>> {

    constructor() {
        super("get", "/tweet/dbs");
    }

}

export default TweetDatabasesRequest;