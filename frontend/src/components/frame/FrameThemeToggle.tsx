import React from 'react';
import {useTranslation} from "react-i18next";
import {
    Box,
    Center,
    ColorScheme,
    Group,
    MediaQuery,
    SegmentedControl,
    useMantineColorScheme
} from '@mantine/core';

import {BsFillMoonFill, BsFillSunFill} from 'react-icons/bs';
import { setCookie } from 'cookies-next';

const FrameThemeToggle = () => {

    const { t } = useTranslation();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const toggleSwitchTheme = (nextColorScheme: string) => {
        setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 356 * 60 * 60 * 24 * 30 });
        toggleColorScheme(nextColorScheme as ColorScheme);
    }

    return <Group position='center' my='xl'>
        <SegmentedControl
            value={colorScheme}
            onChange={(value: 'light' | 'dark') => toggleSwitchTheme(value)}
            data={[
                {
                    value: 'light',
                    label: (
                        <Center>
                            <BsFillSunFill size={16} />
                            <MediaQuery styles={{ display: 'none' }} largerThan='sm'>
                                <Box ml={10}>{t('light')}</Box>
                            </MediaQuery>
                        </Center>
                    ),
                },
                {
                    value: 'dark',
                    label: (
                        <Center>
                            <BsFillMoonFill size={16} />
                            <MediaQuery styles={{ display: 'none' }} largerThan='sm'>
                                <Box ml={10}>{t('dark')}</Box>
                            </MediaQuery>
                        </Center>
                    ),
                },
            ]}
        />
    </Group>
}

export default FrameThemeToggle;