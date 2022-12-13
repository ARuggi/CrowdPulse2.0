import React from 'react';
import axios from 'axios';

import './styles/App.scss';

import LoadingOverlay from './components/LoadingOverlay';
import TweetDatabasesRequest, {TweetDatabasesData} from './requests/tweet/TweetDatabasesRequest';
import {Response} from './requests/AbstractRequest';
import {performResponse} from './util/RequestUtil';
import DatabaseSelection from "./components/DatabaseSelection";
import {withTranslation, WithTranslation} from "react-i18next";

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
                    response!.data as unknown as Response<any>,
                    (result) => {
                        const tweetDatabasesData = result?.data as TweetDatabasesData;
                        tweetDatabasesData.databases = [...tweetDatabasesData.databases]
                            .filter(database => {
                                switch (database.name) {
                                    case "admin":
                                    case "config":
                                    case "test":
                                    case "local":return false;
                                    default:return true;
                                }
                            });
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
                <header className="App-content">
                    <div>
                        <p>text: {t('language')}</p>
                    </div>
                    {!this.state.tweetDatabasesData && <LoadingOverlay message={"Connecting to the server..."}/>}
                    {this.state.tweetDatabasesData && <DatabaseSelection tweetDatabasesData={this.state.tweetDatabasesData}/>}
                </header>
            </div>
        );
    }
}

export default withTranslation()(App);