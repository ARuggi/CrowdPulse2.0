import React from 'react';
import ReactDOM from 'react-dom/client';

import './i18n';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import AppRoutes from './AppRoutes';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App routes={<AppRoutes/>}/>
        </BrowserRouter>
    </React.StrictMode>
);
