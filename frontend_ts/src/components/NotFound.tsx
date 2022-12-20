import { useRouteError } from "react-router-dom";

type Error = {
    statusText: string,
    message: string
}

export default function NotFound() {
    const error = useRouteError() as Error;
    console.error(error);

    return (
        <div id="not-found">
            <h1>404</h1>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}