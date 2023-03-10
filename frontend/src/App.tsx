import React, {useEffect, useState} from 'react';

import Frame from './components/frame';
import {ColorScheme, ColorSchemeProvider, MantineProvider} from '@mantine/core';
import {getCookie, hasCookie} from 'cookies-next';

interface IProps {
    routes: any;
}

const App:React.FC<IProps> = ({routes}) => {
    const [colorScheme, setColorScheme] = useState<ColorScheme | undefined>(undefined);

    useEffect(() => {
        if (hasCookie('mantine-color-scheme')) {
            setColorScheme(getCookie('mantine-color-scheme') as ColorScheme);
        } else {
            setColorScheme('light');
        }
    }, []);

    if (!colorScheme) {
        return <></>;
    }

    const toggleColorScheme = (value?: ColorScheme) => {
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
    }

    return <ColorSchemeProvider
        colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
            <Frame children={routes}/>
        </MantineProvider>
    </ColorSchemeProvider>
}

export default App