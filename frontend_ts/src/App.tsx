import React, {useEffect, useState} from 'react';
import axios from 'axios';

import './styles/App.scss';

import LoadingOverlay from './components/LoadingOverlay';
import TweetDatabasesRequest, {TweetDatabasesData} from './requests/tweet/TweetDatabasesRequest';
import {Response} from './requests/AbstractRequest';
import {performResponse} from './util/RequestUtil';
import DatabaseSelectionBox from "./components/DatabaseSelectionBox";
import {useTranslation} from "react-i18next";
import {Col, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import ErrorOverlay, {ErrorType} from "./components/ErrorOverlay";
import {wait} from "@testing-library/user-event/dist/utils";

axios.defaults.baseURL = "http://localhost:4000";

enum AppState {
    INIT,
    DATABASES_FAILED,
    DATABASES_LOADED
}

const INIT_TWEET_DATABASES_DATA: TweetDatabasesData = {
    databases: []
};

function loadDatabases(setAppState: any, setTweetDatabasesData: any) {

    new TweetDatabasesRequest()
        .sendRequest({})
        .catch(error => {

            wait(1000).then(() => {
                console.log("Server error: " + error?.message);
                setAppState(AppState.DATABASES_FAILED);
            });

        })
        .then(response => {

            if (!response) {
                return;
            }

            performResponse(
                response?.data as unknown as Response<any>,
                (result) => {
                    const tweetDatabasesData = result?.data as TweetDatabasesData;

                    // voluntary waiting
                    wait(500).then(() => {
                        setAppState(AppState.DATABASES_LOADED);
                        setTweetDatabasesData(tweetDatabasesData);
                    });
                },
                (error) => {
                    console.log("KO: " + error?.message);
                    setAppState(AppState.DATABASES_FAILED);
                });
        });
}

function App() {

    const {t} = useTranslation();
    const [appState, setAppState] = useState(AppState.INIT);
    const [tweetDatabasesData, setTweetDatabasesData] = useState(INIT_TWEET_DATABASES_DATA);

    useEffect(() => {
        loadDatabases(setAppState, setTweetDatabasesData);
    }, [tweetDatabasesData]);

    if (appState === AppState.DATABASES_FAILED) {
        return <ErrorOverlay type={ErrorType.DB_ERROR} message={t('serverNotRespondingError')}/>;
    }

    if (tweetDatabasesData.databases.length === 0) {
        return <LoadingOverlay message={t('connectingToServer')}/>;
    }

    return (
        <div className="App">
            <Container fluid>
                <Row id="welcome-message">
                    <Col>
                        <h1>{t('welcome')}</h1>
                    </Col>
                </Row>
                <Row>
                    <DatabaseSelectionBox tweetDatabasesData={tweetDatabasesData}/>
                </Row>
            </Container>
        </div>
    );
}

export default App;