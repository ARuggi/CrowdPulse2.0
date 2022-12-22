import React from 'react';
import {BugFill, DatabaseFillExclamation} from "react-bootstrap-icons";
import { Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";

export enum ErrorType {
    GENERIC = "generic",
    DB_ERROR = "db_error"
}

export type Content = {
    type: ErrorType,
    message: string
}

function getErrorIcon(errorType: ErrorType) {

    if (errorType === ErrorType.DB_ERROR) {
        return <DatabaseFillExclamation style={{marginTop: "-10px"}}/>;
    }

    return <BugFill style={{marginTop: "-10px"}}/>;
}

function ErrorOverlay(content: Content) {
    const {t} = useTranslation();
    return(
        <div
            className="modal show"
            style={{display: 'block', position: 'initial'}}>

            <Modal show={true} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title>{getErrorIcon(content.type)} {t('error')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>{content.message}</h3>
                </Modal.Body>
            </Modal>

        </div>
    );
}

export default ErrorOverlay;