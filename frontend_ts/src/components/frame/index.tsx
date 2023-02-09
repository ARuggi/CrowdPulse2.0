import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {
    AppShell,
    Burger,
    Flex, Group,
    Header,
    MediaQuery,
    Navbar,
    Text,
} from '@mantine/core';
import FrameItem from "./FrameItem";
import FrameThemeToggle from "./FrameThemeToggle";
import FrameLanguageItem from "./FrameLanguageItem";

interface IProps {
    children: any;
}

const AppFrame:React.FC<IProps> = ({children}) => {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState('home');

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
            <Navbar hiddenBreakpoint='sm' hidden={!menuOpen}
                    width={{ sm: 150, lg: 150 }} p='lg' style={{ cursor: 'pointer' }}>
                <Navbar.Section>
                    <FrameItem
                        selected={isSelectedItem('home')}
                        onClick={() => triggerItemClick('home', '/')}
                        content={<Text inline>{t('home')}</Text>}
                    />
                </Navbar.Section>
                <Navbar.Section grow mt='md'>
                    <FrameItem
                        selected={isSelectedItem('databases')}
                        onClick={() => triggerItemClick('databases', '/databases')}
                        content={<Text inline>{t('databases')}</Text>}
                    />
                    <FrameItem
                        selected={isSelectedItem('analysis')}
                        onClick={() => triggerItemClick('analysis', '/analysis')}
                        content={<Text inline>{t('analysis')}</Text>}
                    />
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