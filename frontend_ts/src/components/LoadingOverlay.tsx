import React from 'react';
import {SyncLoader} from "react-spinners";

export type Content = {
    message: string;
}

class LoadingOverlay extends React.Component<Content> {

    render() {
        return(
            <>
                <SyncLoader
                    margin="10px"
                    color="#36d7b7" />
                <br/>
                <h3>{this.props.message}</h3>
            </>
        );
    }
}

export default LoadingOverlay;