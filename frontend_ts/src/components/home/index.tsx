import React from 'react';
import {
    Button,
    Center,
    Container,
    createStyles,
    Group,
    Image,
    List,
    Space,
    Text,
    ThemeIcon,
    Title
} from '@mantine/core';
import image from '../../media/logo.svg';
import {BsCheckLg} from "react-icons/bs";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

const useStyles = createStyles((theme) => ({
    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: theme.spacing.xl * 4,
        paddingBottom: theme.spacing.xl * 4,
    },

    content: {
        maxWidth: 480,
        marginRight: theme.spacing.xl * 3,

        [theme.fn.smallerThan('md')]: {
            maxWidth: '100%',
            marginRight: 0,
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: 44,
        lineHeight: 1.2,
        fontWeight: 900,

        [theme.fn.smallerThan('xs')]: {
            fontSize: 28,
        },
    },

    control: {
        [theme.fn.smallerThan('xs')]: {
            flex: 1,
        },
    },

    image: {
        flex: 1,

        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },

        filter: theme.colorScheme === 'dark' ? 'invert(100%)' : 'invert(0%)',
    }
}));

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { classes } = useStyles();

    const openInNewTab = (url: string) => {
        window.open(url, '_blank', 'noreferrer');
    };

    return <Container>
        <div className={classes.inner}>
            <div className={classes.content}>
                <Title className={classes.title}>
                    <span>{t('homepage.title')}</span>
                    <Space />
                </Title>
                <Text color="dimmed" mt="md">{t('homepage.description')}</Text>
                <List
                    mt={30}
                    spacing="sm"
                    size="sm"
                    icon={
                        <ThemeIcon size={20} radius="xl">
                            <Center><BsCheckLg size={10}/></Center>
                        </ThemeIcon>
                    }>
                    <List.Item>
                        <b>{t('homepage.first-list-item.title')}</b>{t('homepage.first-list-item.description')}
                    </List.Item>
                    <List.Item>
                        <b>{t('homepage.second-list-item.title')}</b>{t('homepage.second-list-item.description')}
                    </List.Item>
                </List>

                <Group mt={30}>
                    <Button
                        onClick={() => navigate('/databases')}
                        radius="xl"
                        size="md"
                        className={classes.control}>
                        {t("homepage.get-started")}
                    </Button>
                    <Button
                        onClick={() => openInNewTab('https://github.com/ARuggi/CrowdPulse2.0.git')}
                        variant="default"
                        radius="xl"
                        size="md"
                        className={classes.control}>
                        {t("homepage.source-code")}
                    </Button>
                </Group>
            </div>
            <Image src={image} className={classes.image} />
        </div>
    </Container>
}

export default Home
