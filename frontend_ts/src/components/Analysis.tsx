import {useSearchParams} from 'react-router-dom';
import {NotFoundGeneric} from "./NotFound";
import React, {useEffect, useState} from "react";
import LoadingOverlay from "./LoadingOverlay";
import {wait} from "@testing-library/user-event/dist/utils";
import {Button, Col, Form, InputGroup, Nav, Navbar, Row, Tab, Table, Tabs} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import {useTranslation} from "react-i18next";
import Container from "react-bootstrap/Container";
import {Funnel, Search} from "react-bootstrap-icons";

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

function Data(props: {tab: AnalysisTab, dbs: string[]}) {
    const {tab, dbs} = props;
    return (
        <>
            {tab === AnalysisTab.INFO && <a>Info</a>}
            {tab === AnalysisTab.SENTIMENT && <a>Sentiment</a>}
            {tab === AnalysisTab.WORD && <a>Word</a>}
            {tab === AnalysisTab.TIMELINE && <a>Timeline</a>}
            {tab === AnalysisTab.TWEET_LIST && <a>Tweet list</a>}
            {tab === AnalysisTab.MAP && <a>Map</a>}
        </>
    );
}

function FiltersBox(props: {dbs: string[]}) {
    const {t} = useTranslation();

    return (
        <>
            <Navbar bg="dark"
                    variant="dark"
                    expand="lg"
                    style={{marginLeft: "10vh", marginRight: "10vh"}}>
                <Container style={{background: "transparent"}}>
                    <Navbar.Brand href="#">
                        <Funnel style={{marginTop: "-5px"}}/> {t('filters')}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarFilters" />
                    <Navbar.Collapse id="navbarFilters">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}>
                        </Nav>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder={t('search').toString()}
                                className="me-2 bg-dark"
                                aria-label="Search"/>
                            <Button variant="outline-success">
                                <Search style={{marginTop: "-5px", marginLeft: "1px"}}/>
                            </Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Row xs={1}
                 md={2}
                 className="g-2">
                <Col>
                    <Row xs={1}
                         md={2}
                         style={{
                             marginRight: "0px",
                             marginLeft: "0px",
                             marginBottom: "1vh"}}>
                        <Card bg={"dark"}
                              className={"filter-card"}>
                            <Card.Body
                                style={{
                                    marginRight: "-10px",
                                    marginLeft: "-10px"}}>
                                <Card.Title>Algorithm</Card.Title>
                                <Card.Text>
                                    <Form.Select
                                        aria-label="Default select example">
                                        <option value="1" selected>All</option>
                                        <option value="2">1</option>
                                        <option value="3">2</option>
                                    </Form.Select>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card bg={"dark"}
                              className={"filter-card"}>
                            <Card.Body
                                style={{
                                    marginRight: "-10px",
                                    marginLeft: "-10px"}}>
                                <Card.Title>Sentiment</Card.Title>
                                <Card.Text>
                                    <Form.Select
                                        aria-label="Default select example">
                                        <option value="1" selected>All</option>
                                        <option value="2">1</option>
                                        <option value="3">2</option>
                                    </Form.Select>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Row>
                    <Card bg={"dark"}
                          className={"filter-card"}
                          style={{alignItems: "center"}}>
                        <Card.Body style={{width: "100%"}}>
                            <Card.Title>Interval</Card.Title>
                            <Card.Text>
                                <Form.Group controlId="dob">
                                    <Form.Control type="date" name="dob" placeholder="Date of Birth" />
                                </Form.Group>
                                <Form.Group controlId="dob">
                                    <Form.Control type="date" name="dob" placeholder="Date of Birth" />
                                </Form.Group>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card bg={"dark"} className={"filter-card"}>
                        <Card.Body>
                            <Card.Title>Other filters</Card.Title>
                            <Card.Text>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="input-texts">Texts</InputGroup.Text>
                                    <Form.Control placeholder="Texts" aria-label="Texts"/>
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="input-hashtags">Hashtags</InputGroup.Text>
                                    <Form.Control placeholder="Hashtags" aria-label="Hashtags"/>
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="input-usernames">Usernames</InputGroup.Text>
                                    <Form.Control placeholder="Usernames" aria-label="Usernames"/>
                                </InputGroup>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

function setActiveAnalysisTab(tab: AnalysisTab) {
    alert(tab);
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
                    <Tabs defaultActiveKey={AnalysisTab.INFO}
                          id="content-box-tab"
                          className="mb-3"
                          onSelect={(k) => setActiveAnalysisTab(k as AnalysisTab)}
                          justify>
                        <Tab eventKey={AnalysisTab.INFO}
                             title={"Info"}>
                            <Data tab={AnalysisTab.INFO}
                                  dbs={dbs}/>
                        </Tab>
                        <Tab eventKey={AnalysisTab.SENTIMENT}
                             title={"Sentiment"}>
                            <Data tab={AnalysisTab.SENTIMENT}
                                  dbs={dbs}/>
                        </Tab>
                        <Tab eventKey={AnalysisTab.WORD}
                             title={"Word"}>
                            <Data tab={AnalysisTab.WORD}
                                  dbs={dbs}/>
                        </Tab>
                        <Tab eventKey={AnalysisTab.TIMELINE}
                             title={"Timeline"}>
                            <Data tab={AnalysisTab.TIMELINE}
                                  dbs={dbs}/>
                        </Tab>
                        <Tab eventKey={AnalysisTab.TWEET_LIST}
                             title={"Tweet list"}>
                            <Data tab={AnalysisTab.TWEET_LIST}
                                  dbs={dbs}/>
                        </Tab>
                        <Tab eventKey={AnalysisTab.MAP}
                             title={"Map"}>
                            <Data tab={AnalysisTab.MAP}
                                  dbs={dbs}/>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>

        </div>
    )

}

export default Analysis;