import { useRouteError } from "react-router-dom";

type Error = {
    statusText: string | undefined,
    message: string | undefined
}

export default function NotFound() {
    const error = useRouteError() as Error;
    console.error(error);
    const errorMessage = error.statusText ? error.statusText : error.message;

    return (
        <NotFoundGeneric errorMessage={errorMessage}/>
    );
}

export function NotFoundGeneric(error: {errorMessage: string | undefined}) {

    return (
        <div id="not-found">
            <h1>404</h1>
            <p>
                <i>{error?.errorMessage}</i>
            </p>
        </div>
    );
}