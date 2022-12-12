import React from 'react';
import axios from 'axios';

import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingOverlay from './components/LoadingOverlay';
import TweetDatabasesRequest, {TweetDatabasesData} from './requests/tweet/TweetDatabasesRequest';
import {Response} from './requests/AbstractRequest';
import {performResponse} from './util/RequestUtil';
import DatabaseSelection from "./components/DatabaseSelection";

axios.defaults.baseURL = "http://localhost:4000";

type AppState = {
    tweetDatabasesData: TweetDatabasesData | undefined;
}

class App extends React.Component<any> {

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
                        tweetDatabasesData.databases = [...tweetDatabasesData.databases]
                            .filter(database => {
                                switch (database.name) {
                                    case "admin":
                                    case "config":
                                    case "test":
                                    case "local":
                                        return true;
                                    default:
                                        return false;
                                }
                            });

                        this.setState({tweetDatabasesData});
                    },
                    (error) => {
                        console.log("Error: " + error?.message);
                    })
            })

        /*axios.get('/tweet/dbs')
            .then((response) => {

                let dbs = [];
                const {databases} = response.data.data.databases;

                databases.forEach((database: { name: any; }) => {
                    let databaseName = database.name;
                    if (databaseName !== "admin"
                        && databaseName !== "config"
                        && databaseName !== "test"
                        && databaseName !== "local") {
                        dbs.push(databaseName);
                    }
                });

                this.setState({dbs});
            }).catch((error) => {
            console.log('error: ', error)
        });*/
    }

    render() {

        if (!this.state.tweetDatabasesData) {
            this.loadDatabases();
        }

        return (
            <div className="App">
                <header className="App-content">
                    {!this.state.tweetDatabasesData && <LoadingOverlay message={"Connecting to the server..."}/>}
                    {this.state.tweetDatabasesData && <DatabaseSelection tweetDatabasesData={this.state.tweetDatabasesData}/>}
                </header>
            </div>
        );
    }
}

export default App;
