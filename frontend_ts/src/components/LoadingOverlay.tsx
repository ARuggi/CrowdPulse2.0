import React from 'react';
import {SyncLoader} from "react-spinners";
import { Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";

export type Content = {
    message: string;
}

function LoadingOverlay(content: Content) {
    const {t} = useTranslation();
    return(
        <div
            className="modal show"
            style={{display: 'block', position: 'initial'}}>
            <Modal show={true} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title>{t('loading')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SyncLoader
                        margin="10px"
                        color="#36d7b7" />
                    <br/>
                    <h3>{content.message}</h3>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default LoadingOverlay;