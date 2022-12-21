import React from 'react';
import axios from 'axios';

import './styles/App.scss';

import LoadingOverlay from './components/LoadingOverlay';
import TweetDatabasesRequest, {TweetDatabasesData} from './requests/tweet/TweetDatabasesRequest';
import {Response} from './requests/AbstractRequest';
import {performResponse} from './util/RequestUtil';
import DatabaseSelectionBox from "./components/DatabaseSelectionBox";
import {withTranslation, WithTranslation} from "react-i18next";
import {Col, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";

axios.defaults.baseURL = "http://localhost:4000";

type AppState = {
    tweetDatabasesData: TweetDatabasesData | undefined;
}

class App extends React.Component<WithTranslation> {

    state: AppState = {
        tweetDatabasesData: undefined
    }

    loadDatabases() {
        new TweetDatabasesRequest()
            .sendRequest({})
            .catch(error => {
                alert("Server error: " + error.message)
            })
            .then(response => {
                performResponse(
                    response?.data as unknown as Response<any>,
                    (result) => {
                        const tweetDatabasesData = result?.data as TweetDatabasesData;
                        this.setState({tweetDatabasesData});
                    },
                    (error) => {
                        console.log("Error: " + error?.message);
                    })
            });
    }

    render() {

        if (!this.state.tweetDatabasesData) {
            this.loadDatabases();
        }

        const {t} = this.props;

        return (
            <div className="App">
                {!this.state.tweetDatabasesData && <LoadingOverlay message={t('connectingToServer')}/>}
                {this.state.tweetDatabasesData &&
                    <>
                        <Container fluid>
                            <Row id="welcome-message">
                                <Col>
                                    <h1>{t('welcome')}</h1>
                                </Col>
                            </Row>
                            <Row>
                                <DatabaseSelectionBox tweetDatabasesData={this.state.tweetDatabasesData}/>
                            </Row>
                        </Container>
                    </>
                }
            </div>
        );
    }
}

export default withTranslation()(App);