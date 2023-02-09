import React, {useEffect, useState} from 'react';
import {Route, Routes} from 'react-router-dom';

import Index from './components/home';
import Databases from './components/databases';
import Analysis from './components/analysis';
import NotFound from './components/notFound';
import Frame from './components/frame';
import {ColorScheme, ColorSchemeProvider, MantineProvider} from "@mantine/core";
import {getCookie, hasCookie} from "cookies-next";

const App = () => {

    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

    useEffect(() => {
        if (hasCookie('mantine-color-scheme')) {
            setColorScheme(getCookie('mantine-color-scheme') as ColorScheme);
        }
    }, []);

    const toggleColorScheme = (value?: ColorScheme) => {
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
    }

    return <ColorSchemeProvider
        colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <Frame children={
                <Routes>
                    <Route index element={<Index />} path='/' />
                    <Route       element={<Databases />} path='/databases' />
                    <Route       element={<Analysis />}  path='/analysis' />
                    <Route       element={<NotFound />}  path='*' />
                </Routes>
            }/>
        </MantineProvider>
    </ColorSchemeProvider>
}

export default App