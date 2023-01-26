import React from 'react';
import {TweetDatabasesData, DatabaseType} from '../requests/v1/DatabasesRequest';
import {useTranslation} from "react-i18next";
import Card from 'react-bootstrap/Card';
import {Col, Row} from "react-bootstrap";
import {Database} from 'react-bootstrap-icons';
import {useNavigate} from "react-router-dom";

export type Content = {
    tweetDatabasesData: TweetDatabasesData;
}

function DatabaseSelectionBox(props: Content) {

    const handleClick = (database: DatabaseType): void => {
        navigate(`/analysis?db=${database.name}`);
    }

    const navigate = useNavigate();
    const {t} = useTranslation();

    return (
        <Row id="databases-container">
            <Col>
                <Card bg="dark"
                      border="dark">

                    <Card.Header>{t('selectDatabase')}</Card.Header>
                    <Card.Body className="d-flex justify-content-center align-items-center">
                        <Row xs={1}
                             md={2}
                             className="g-0">

                            {props.tweetDatabasesData.databases.map((database: DatabaseType, i: number) => (
                                <Col key={i}>
                                    <Card className="database-card-item h-100 gy-3"
                                          bg="dark"
                                          border="dark">
                                        <Card.Body className="database-card-item-body"
                                                   onClick={() => handleClick(database)}>

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
                                </Col>
                            ))}

                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default DatabaseSelectionBox;