import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import NotFound from './components/NotFound'

import 'bootstrap';
import 'react-bootstrap';
import 'react-bootstrap-icons'
import './styles/index.scss';

import './i18n';
import App from './App';
import Navbar from "./components/Navbar";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <NotFound/>
    }
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Navbar/>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
