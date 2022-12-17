import React from 'react';
import {TweetDatabasesData, DatabaseType} from '../requests/tweet/TweetDatabasesRequest';
import {useTranslation} from "react-i18next";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import {Col, Row} from "react-bootstrap";
import {Database} from 'react-bootstrap-icons';

export type Content = {
    tweetDatabasesData: TweetDatabasesData;
}

function Welcome(props: Content) {
    const {t} = useTranslation();

    return (
        <Container fluid>
            <Row id="welcomeMessage">
                <Col>
                    <h1>{t('welcome')}</h1>
                </Col>
            </Row>
            <Row id="welcomeCard">
                <Col>
                    <Card bg="dark" border="dark">
                        <Card.Header>{t('welcomeSelectDatabase')}</Card.Header>
                        <Card.Body className="d-flex justify-content-center align-items-center">

                            <Row xs={1} md={2} className="g-0">
                                {props.tweetDatabasesData.databases.map((database: DatabaseType, i: number) => (
                                    <Col key={i}>
                                        <Card className="welcome-card-item h-100 gy-3" bg="dark" border="dark">

                                            <Card.Body className="welcome-card-item-body">
                                                <div className="row g-0">
                                                    <div className="col-md-4">
                                                        {!database.info.icon && <Database className="img-fluid rounded-start col-md-4"/>}
                                                        {database.info.icon && <img src={`data:image/jpeg;base64,${database.info.icon}`} alt="Icon"/>}
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="card-body">
                                                            <h5 className="card-title">{database.name}</h5>
                                                            <div className="card-text" dangerouslySetInnerHTML={{__html: database.info.htmlDescription}}></div>
                                                            <div className="card-text footer">
                                                                {}
                                                                <small className="text-muted">Release update: {database.info.releaseDate ? database.info.releaseDate.toString() : "undefined"}</small>
                                                                <br/>
                                                                <small className="text-muted">Last update: {database.info.lastUpdateDate ? database.info.lastUpdateDate.toString() : "undefined"}</small>
                                                                <br/>
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
        </Container>
    );
}

export default Welcome;