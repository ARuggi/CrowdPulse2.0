import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
    createStyles,
    Group,
    Image,
    Menu,
    UnstyledButton,
} from '@mantine/core';
import {AiOutlineDown} from 'react-icons/ai';

import i18next from 'i18next';

const useStyles = createStyles((theme, { opened }: { opened: boolean }) => ({
    control: {
        width: 200,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        borderRadius: theme.radius.md,
        border: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]
        }`,
        transition: 'background-color 150ms ease',
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.colors.dark[opened ? 5 : 6]
                : opened
                    ? theme.colors.gray[0]
                    : theme.white,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },

    lang: {
        fontWeight: 500,
        fontSize: theme.fontSizes.sm,
    },

    icon: {
        transition: 'transform 150ms ease',
        transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
    },
}));

async function loadFlagImage(name: string) {
    const img = await import(`../../media/flags/${name}.png`);
    return img.default;
}

const FrameThemeToggle = () => {

    const { t, i18n } = useTranslation();
    const languages = Object.keys(i18next.services.resourceStore.data);

    const [data, setData] = useState(languages.map(lang => {
        return {lang: lang, name: t('language', {lng: lang, defaultValue: ''})!, image: null}}
    ));

    useEffect(() => {
        (async () => {

            let loadedData = [...data];
            loadedData = await Promise.all(
                loadedData.map(async item => {
                    return {
                        lang: item.lang,
                        name: item.name,
                        image: await loadFlagImage(`${item.lang}`)
                    }
                })
            );

            setData(loadedData);
        })()
    }, []);

    const getLangData = (lang: string) => {
        return data.find(item => item.lang === lang);
    }

    const [opened, setOpened] = useState(false);
    const { classes } = useStyles({ opened });
    const [selected, setSelected] = useState(getLangData(i18n.language));

    const triggerClick = (item: any) => {
        setSelected(item);
        i18n.changeLanguage(item?.lang)
            .then(() => console.log(`language changed to '${item?.lang}'`));
    }

    const items = data.map((item) => (
        <Menu.Item
            icon={<Image src={item.image} width={18} height={18}/>}
            onClick={() => triggerClick(item)}
            key={item.lang}>
            {item.name}
        </Menu.Item>
    ));

    return <Menu
        onOpen={() => setOpened(true)}
        onClose={() => setOpened(false)}
        withArrow
        transition='rotate-left'
        radius='md'
        width='fit-content'>
        <Menu.Target>
            <UnstyledButton className={classes.control}>
                <Group spacing='xs'>
                    <Image src={getLangData(i18n.language)?.image} width={22} height={22}/>
                    <span className={classes.lang}>{selected?.name}</span>
                </Group>
                <AiOutlineDown size={16} className={classes.icon}/>
            </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
}

export default FrameThemeToggle;