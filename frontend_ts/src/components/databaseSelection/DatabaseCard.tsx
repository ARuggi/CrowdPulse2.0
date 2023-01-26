import {DatabaseType} from "../../requests/v1/DatabasesRequest";
import Card from "react-bootstrap/Card";
import {Database} from "react-bootstrap-icons";
import React, {useEffect, useState} from "react";

let handleSelectionCallback: React.MouseEventHandler<HTMLDivElement>;

function DatabaseCard(props: {database: DatabaseType, selectionCallback: (database: DatabaseType) => void}) {

    const [init, setInit] = useState(false);
    const {database, selectionCallback} = props;

    useEffect(() => {

        handleSelectionCallback = () => {
            selectionCallback(database);
        }

        setInit(true);
    }, [init]);

    return (
        <Card className="database-card-item h-100 gy-3"
              bg="dark"
              border="dark">
            <Card.Body className="database-card-item-body"
                       onClick={handleSelectionCallback}>

                <div className="row g-0">
                    <div className="col-md-4">
                        {!database.info.icon && <Database className="img-fluid rounded-start col-md-4"/>}
                        {database.info.icon && <img src={`data:image/jpeg;base64,${database.info.icon}`} alt="Icon"/>}
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title">{database.name}</h5>
                            <div className="card-text"
                                 dangerouslySetInnerHTML={{__html: database.info.htmlDescription}}/>
                            <div className="card-text footer">
                                <small className="text-muted">Release update: {database.info.releaseDate ? database.info.releaseDate.toString() : "undefined"}</small><br/>
                                <small className="text-muted">Last update: {database.info.lastUpdateDate ? database.info.lastUpdateDate.toString() : "undefined"}</small><br/>
                                <small className="text-muted">Version: {database.info.version ? database.info.version : "undefined"}</small>
                            </div>
                        </div>
                    </div>
                </div>

            </Card.Body>
        </Card>
    );
}

export default DatabaseCard;