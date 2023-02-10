import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {
    AppShell,
    Box,
    Burger,
    Divider,
    Flex,
    Group,
    Header,
    MediaQuery,
    Navbar,
    ScrollArea,
    Text,
} from '@mantine/core';
import FrameItem from './FrameItem';
import FrameThemeToggle from './FrameThemeToggle';
import FrameLanguageItem from './FrameLanguageItem';
import {getCookie, hasCookie} from 'cookies-next';

interface IProps {
    children: any;
}

const AppFrame:React.FC<IProps> = ({children}) => {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState('home');
    let analysisArray = undefined;

    if (hasCookie('analysis')) {
        analysisArray = JSON.parse(getCookie('analysis') as string) as Array<any>;
    }

    const isSelectedItem = (item: string) => {
        return selectedItem === item;
    }

    const triggerItemClick = (item: string, to: string) => {
        setSelectedItem(item);
        setMenuOpen(false);
        navigate(to);
    }


    return <AppShell
        navbar={
            <Navbar hiddenBreakpoint='sm'
                    hidden={!menuOpen}
                    width={{ sm: 250, lg: 250 }}
                    p='lg'
                    style={{ cursor: 'pointer' }}>
                <Navbar.Section>
                    <FrameItem
                        selected={isSelectedItem('home')}
                        onClick={() => triggerItemClick('home', '/')}
                        content={<Text inline>{t('home')}</Text>}
                    />
                </Navbar.Section>
                <Divider my='sm' />
                <Navbar.Section>
                    <FrameItem
                        selected={isSelectedItem('databases')}
                        onClick={() => triggerItemClick('databases', '/databases')}
                        content={<Text inline>{t('databases')}</Text>}
                    />
                </Navbar.Section>
                <Navbar.Section
                    grow
                    mx='-xs'
                    px='xs'
                    component={ScrollArea}>
                    {analysisArray && <>
                        <Divider my='sm' />
                        <Text inline style={{marginTop: '10px', marginLeft: '10px', opacity: '0.35'}}>{t('analysis')}</Text>
                        <Box py='md'>
                            {analysisArray
                                .filter(analyse => analyse?.name !== undefined)
                                .map(analyse => {
                                    const token = 'analysis_' + analyse.name;
                                    let params = new URLSearchParams();
                                    analyse?.selectedDatabases.forEach((name: string) => params.append('dbs', name));

                                    return <FrameItem
                                        key={analyse.name}
                                        selected={isSelectedItem(token)}
                                        onClick={() => triggerItemClick(token, `/analysis?${params}`)}
                                        content={
                                            <Box style={{
                                                borderRadius: '5px',
                                                borderWidth: 'thin',
                                                borderStyle: 'double double double double',
                                                textAlign: 'center',
                                                padding: '5px',
                                            }}>
                                                <Text inline>{analyse.name}</Text>
                                            </Box>}/>
                                })}
                        </Box>
                    </>}
                </Navbar.Section>
                <Navbar.Section>
                    <Group position='center' my='xs'>
                        <FrameLanguageItem/>
                        <FrameThemeToggle/>
                    </Group>
                </Navbar.Section>
            </Navbar>}
        header={
            <Header height={{ base: 50, md: 70}} p='md'>
                <Flex align='center' h='100%'>
                    <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
                        <Burger
                            opened={menuOpen}
                            onClick={() => setMenuOpen((open) => !open)}
                            size='sm'
                            mr='xl'
                        />
                    </MediaQuery>
                    <Text fw={700}>{t('projectName')}</Text>
                </Flex>
            </Header>}
        children={children}
    />
}

export default AppFrame;