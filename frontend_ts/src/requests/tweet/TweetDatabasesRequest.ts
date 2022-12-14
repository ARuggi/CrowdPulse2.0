import AbstractRequest, {Response} from "../AbstractRequest";

export type DatabaseType = {
    name: string,
    sizeOnDisk: string,
    empty: boolean
}

export type TweetDatabasesData = {
    databases: DatabaseType[]
}

class TweetDatabasesRequest extends AbstractRequest<{}, Response<TweetDatabasesData>> {

    constructor() {
        super("get", "/tweet/dbs");
    }

}

export default TweetDatabasesRequest;