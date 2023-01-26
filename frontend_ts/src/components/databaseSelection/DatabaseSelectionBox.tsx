import React, {useEffect, useState} from 'react';
import {DatabasesData, DatabaseType} from '../../requests/v1/DatabasesRequest';
import {useTranslation} from "react-i18next";
import Card from 'react-bootstrap/Card';
import {Col, Row} from "react-bootstrap";
import {useNavigate} from 'react-router-dom';
import DatabaseCard from './DatabaseCard';

let handleSelection: (database: DatabaseType) => void;

function DatabaseSelectionBox(props: {databasesData: DatabasesData}) {

    const [init, setInit] = useState(false);
    const [database, setDatabase] = useState<DatabaseType | undefined>(undefined);

    const navigate = useNavigate();
    const {t} = useTranslation();

    useEffect(() => {
        // init functions
        handleSelection = (database: DatabaseType): void => {
            setDatabase(database);
        }

        setInit(true);
    }, [init]);

    // Will be executed each time the component is rendered.
    useEffect(() => {
        if (database) {
            navigate(`/analysis?db=${database.name}`);
        }
    });

    if (!handleSelection) {
        return <></>;
    }

    return (
        <Row id="databases-container">
            <Col>
                <Card bg="dark"
                      border="dark">

                    <Card.Header>{t('selectDatabase')}</Card.Header>
                    <Card.Body className="d-flex justify-content-center align-items-center">
                        <Row xs={1}
                             md={2}
                             className="g-0">

                            {props
                                .databasesData
                                .databases
                                .map((database: DatabaseType, i: number) => {
                                    return {index: i, database: database};
                                })
                                .map((wrapper) => (
                                    <Col key={wrapper.index}>
                                        <DatabaseCard
                                            database={wrapper.database}
                                            selectionCallback={handleSelection}/>
                                    </Col>
                                ))}

                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default DatabaseSelectionBox;