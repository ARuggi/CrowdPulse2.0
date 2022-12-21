import {useSearchParams} from 'react-router-dom';
import {NotFoundGeneric} from "./NotFound";
import {useEffect, useState} from "react";
import LoadingOverlay from "./LoadingOverlay";
import {wait} from "@testing-library/user-event/dist/utils";

enum AnalysisState {
    NONE,
    LOADING,
    DONE
}

function RenderResults() {
    return (
        <div>
            <p>Test</p>
        </div>
    );
}

function Analysis() {

    const [analysisState, setAnalysisState] = useState(AnalysisState.NONE);
    const [searchParams] = useSearchParams();
    const dbs: string[] | null = searchParams.getAll("db");
    //const filters: string[] | null = searchParams.getAll("filter");

    useEffect(() => {

        wait(1000).then(r => {

            switch (analysisState) {
                case AnalysisState.NONE:    setAnalysisState(AnalysisState.LOADING); break;
                case AnalysisState.LOADING: setAnalysisState(AnalysisState.DONE); break;
                default: break;
            }

        });
    }, [analysisState]);

    if (!dbs || dbs.length == 0) {
        return <NotFoundGeneric errorMessage={"No database selected"}/>;
    }

    switch (analysisState) {
        case AnalysisState.NONE: return <LoadingOverlay message={"Loading 1"}/>;
        case AnalysisState.LOADING: return <LoadingOverlay message={"Loading 2"}/>;
        default: return <RenderResults/>;
    }

}

export default Analysis;