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

function Welcome(content: Content) {
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
                        <Card.Body>

                            <Row xs={1} md={2} className="g-0">
                                {content.tweetDatabasesData.databases.map((database: DatabaseType, i: number) => (
                                    <Col key={i}>
                                        <Card className="welcome-card-item" bg="dark" border="dark">

                                            <Card.Body>
                                                <div className="row g-0">
                                                    <div className="col-md-4">
                                                        <Database className="img-fluid rounded-start col-md-4"/>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="card-body">
                                                            <h5 className="card-title">{database.name}</h5>
                                                            <p className="card-text">This is a wider card with
                                                                supporting text below as a natural lead-in to additional
                                                                content. This content is a little bit longer.</p>
                                                            <p className="card-text"><small className="text-muted">Last
                                                                updated 3 mins ago</small></p>
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