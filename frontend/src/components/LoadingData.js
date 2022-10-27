import React from 'react';

import axios from 'axios';

import PreLoader from "./preloader";
import dataImg from '../img/2.jpg';
import queryImg from '../img/3.jpg';

//TODO: Rename this class name.
class Home extends React.Component {

    constructor (props) {
        super(props)
        this.sendData = this.sendData.bind(this)
        this.state = {
            dataTags: [],
            dataText: [],
            dataHashtags: [],
            dataTweet: [],
            dataSortByDate: [],
            users: [],
            flag: 0
        }
        //this.getAllData(this.props.db)
    }

    componentDidMount() {
        this.getAllData(this.props.db);
    }

    getAllData(db) {
        axios.all([
            /*
            axios.get('/tweet/getAnalyzedData', {
              params: {
                db: db
              },

            }),*/
            axios.get('/tweet/getDataSortByDate',{
                params: {
                    db: db
                }
            }),
            axios.get('/tweet/getHashtags',{
                params: {
                    db: db
                }
            }),
            axios.get('/tweet/getText',{
                params: {
                    db: db
                }
            }),
            axios.get('/tweet/getTags',{
                params: {
                    db: db
                }
            }),
            axios.get('/tweet/getUsers',{
                params: {
                    db: db
                }
            }),
        ]).then(axios.spread((dataSortByDate, dataHashtags, dataText, dataTags, users) => {

            // All requests are now complete

            this.setState({dataSortByDate});
            //this.state.dataSortByDate = dataSortByDate;
            this.setState({dataHashtags});
            //this.state.dataHashtags = dataHashtags;
            this.setState({dataText});
            //this.state.dataText = dataText;
            this.setState({dataTags});
            //this.state.dataTags = dataTags;
            this.setState({users});
            //this.state.users = users;
            this.setState({flag: 1});
            this.sendData();
        }));
    }

    sendData() {
        this.props.parentCallback(this.state);
    }

    render() {
        let body;

        if (this.state.flag === 1) {
            body = (
                <>
                    {/* ! Main */}
                    <main className="main users chart-page" id="skip-target">
                        <div className="container">
                            <br/><br/>
                            <h3>Dati caricati correttamente hai selezionato  il db : {this.props.mongodb} </h3><br/><br/><br/>
                            <div className="row">

                                <div className="col-lg-4 howBox">
                                    <div className="how">
                                        <img src={dataImg}/>
                                        <br/>
                                        <b>2</b>
                                        <br/>

                                        Selezioni i grafici che ti interessano
                                    </div>
                                </div>
                                <div className="col-lg-4 howBox">
                                    <div className="how">
                                        <img src={queryImg}/>
                                        <br/>
                                        <b>3</b>
                                        <br/>
                                        Utilizza i filtri per essere più preciso
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </>
            );
        } else {
            body = (
                <div className="row">
                    <div className="col-lg-12">
                        <div className="chart"> <PreLoader/></div>
                    </div>
                </div>
            );
        }

        return (
            <div className="main-wrapper">
                {/* ! Main */}
                <main className="main users chart-page" id="skip-target">
                    <div className="container">
                        <h1 className="homeTitle">CrowdPulse Dashboard</h1>
                        <br/><br/><br/><br/><br/><br/><br/>
                        {body}
                    </div>
                </main>
                {/* ! Footer */}
                <footer className="footer" style={{ background: 'blue' }}>
                    <div className="container footer--flex">
                        <div className="footer-start">
                            <p>2021 © Giovanni Tempesta </p>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}

export default Home;