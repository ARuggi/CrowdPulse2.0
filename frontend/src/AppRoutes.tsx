import React from 'react';
import {Route, Routes} from 'react-router-dom';

import Home from './components/home';
import Databases from './components/databases';
import Analysis from './components/analysis';
import NotFound from './components/notFound';

const AppRoutes = () => {
    return <Routes>
        <Route index element={<Home />}/>
        <Route       element={<Databases />} path='databases' />
        <Route       element={<Analysis />}  path='analysis' />
        <Route       element={<NotFound />}  path='*' />
    </Routes>
}

export default AppRoutes;