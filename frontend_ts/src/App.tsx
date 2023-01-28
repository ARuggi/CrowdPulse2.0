import React, {useEffect, useState} from 'react';
import axios from 'axios';

import './styles/App.scss';

import LoadingOverlay from './components/LoadingOverlay';
import DatabasesRequest, {DatabasesData} from './requests/v1/DatabasesRequest';
import {Response} from './requests/AbstractRequest';
import {filterResponse} from './util/RequestUtil';
import DatabaseSelectionBox from "./components/databaseSelection/DatabaseSelectionBox";
import {useTranslation} from "react-i18next";
import {Col, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import ErrorOverlay, {ErrorType} from "./components/ErrorOverlay";

axios.defaults.baseURL = "http://localhost:4000";

enum AppState {
    UNITIALIZED,
    ERROR,
    READY
}

function loadDatabases(): Promise<DatabasesData> {
    return new DatabasesRequest()
        .sendRequest()
        .then(response => filterResponse(response as Response<DatabasesData>))
        .then(response => response.data);
}

function App() {
    const {t} = useTranslation();
    const [appState, setAppState] = useState(AppState.UNITIALIZED);
    const [databasesData, setDatabasesData] = useState<DatabasesData>({databases: []});

    useEffect(() => {
        loadDatabases()
            .then(data => {
                setDatabasesData(data);
                setAppState(AppState.READY);
            })
            .catch(error => {
                console.log(error);
                setAppState(AppState.ERROR);
            });
    }, []);

    if (appState === AppState.ERROR) {
        return <ErrorOverlay
            type={ErrorType.DB_ERROR}
            message={t('serverNotRespondingError')}/>;
    }

    if (databasesData.databases.length === 0) {
        return <LoadingOverlay message={t('connectingToServer')}/>;
    }

    return (
        <Container fluid>
            <Row id={"welcome-message"}>
                <Col>
                    <h1>{t('welcome')}</h1>
                </Col>
            </Row>
            <Row>
                <DatabaseSelectionBox databasesData={databasesData}/>
            </Row>
        </Container>
    );
}

export default App;