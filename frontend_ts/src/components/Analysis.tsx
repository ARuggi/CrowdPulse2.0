import {useSearchParams} from 'react-router-dom';
import {NotFoundGeneric} from "./NotFound";
import React, {useEffect, useState} from "react";
import LoadingOverlay from "./LoadingOverlay";
import {wait} from "@testing-library/user-event/dist/utils";
import {Col, Row, Tab, Tabs} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import {useTranslation} from "react-i18next";
import {SyncLoader} from "react-spinners";

enum AnalysisState {
    INIT,
    LOADING,
    DONE
}

enum AnalysisTab {
    INFO = "INFO",
    SENTIMENT = "SENTIMENT",
    WORD = "WORD",
    TIMELINE = "TIMELINE",
    TWEET_LIST = "TWEET_LIST",
    MAP = "MAP"
}

function Data() {
    return (
        <>
            <SyncLoader
                margin="10px"
                color="#36d7b7" />
            <br/>
            <h3>{"Loading..."}</h3>
        </>
    );
}

function FiltersBox(props: {dbs: string[]}) {
    const {t} = useTranslation();

    return (
        <Col>
            <Card id={"filters"}
                  bg="dark"
                  border="dark">
                <Card.Header>
                    {t('analysisOfDbs').replace("%dbs%", props.dbs.join(", "))}
                </Card.Header>
                <Card.Body className="justify-content-center">
                    <Row className="g-0" xs={1} md={1}>

                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
}

function Analysis() {

    const [analysisState, setAnalysisState] = useState(AnalysisState.INIT);

    const [searchParams] = useSearchParams();
    const dbs: string[] | null = searchParams.getAll("db");
    //const filters: string[] | null = searchParams.getAll("filter");

    useEffect(() => {

        wait(1000).then(() => {

            switch (analysisState) {
                case AnalysisState.INIT:    setAnalysisState(AnalysisState.LOADING); break;
                case AnalysisState.LOADING: setAnalysisState(AnalysisState.DONE); break;
                default: break;
            }

        });
    }, [analysisState]);

    if (!dbs || dbs.length === 0) {
        return <NotFoundGeneric errorMessage={"No database selected"}/>;
    }

    switch (analysisState) {
        case AnalysisState.INIT: return <LoadingOverlay message={"Loading 1"}/>;
        case AnalysisState.LOADING: return <LoadingOverlay message={"Loading 2"}/>;
        default: break;
    }

    return (
        <div id={"analysis-container"}>
            <FiltersBox dbs={dbs}/>

            <Card id={"content"}
                  bg="dark"
                  border="dark">
                <Card.Body>
                    <Tabs defaultActiveKey="profile"
                          id="content-box-tab"
                          className="mb-3"
                          //onSelect={(k) => setActiveAnalysisTab(k as AnalysisTab)}
                          justify>
                        <Tab eventKey={AnalysisTab.INFO} title="Info"><Data/></Tab>
                        <Tab eventKey={AnalysisTab.SENTIMENT} title="Sentiment"><Data/></Tab>
                        <Tab eventKey={AnalysisTab.WORD} title="Word"><Data/></Tab>
                        <Tab eventKey={AnalysisTab.TIMELINE} title="Timeline"><Data/></Tab>
                        <Tab eventKey={AnalysisTab.TWEET_LIST} title="Tweet list"><Data/></Tab>
                        <Tab eventKey={AnalysisTab.MAP} title="Map"><Data/></Tab>
                    </Tabs>
                </Card.Body>
            </Card>

        </div>
    )

}

export default Analysis;