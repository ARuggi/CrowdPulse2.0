import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import i18next from 'i18next';

import {
    createStyles,
    Group,
    Image,
    Menu,
    UnstyledButton,
} from '@mantine/core';
import {AiOutlineDown} from 'react-icons/ai';

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

type LangType = {
    lang: string,
    name: string,
    image: any
}

const FrameThemeToggle = () => {

    const { t, i18n } = useTranslation();

    const [locales, setLocales] = useState<LangType[] | null>(null);
    const [selected, setSelected] = useState<LangType | undefined>(undefined);
    const [opened, setOpened] = useState(false);
    const { classes } = useStyles({ opened });

    useEffect(() => {
        (async () => {
            const i18nLangArray: string[] = Object.keys(i18next.services.resourceStore.data);
            const loadedLocales: LangType[] = [];

            for (const lang of i18nLangArray) {
                const langType: LangType = {
                    lang: lang,
                    name: t('language', {lng: lang, defaultValue: ''})!,
                    image: await loadFlagImage(`${lang}`)
                }

                loadedLocales.push(langType);
            }

            let selectedLang = loadedLocales.find(item => item.lang === i18n.language);

            if (!selectedLang) {
                selectedLang = loadedLocales.find(item => item.lang === 'en');
            }

            setLocales(loadedLocales);
            setSelected(selectedLang);

        })()
    }, []);

    if (!locales || !selected) {
        return <></>;
    }

    const triggerClick = (item: any) => {
        setSelected(item);
        i18n.changeLanguage(item?.lang)
            .then(() => console.log(`language changed to '${item?.lang}'`));
    }

    const items = locales.map((item) => (
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
                    <Image src={selected!.image} width={22} height={22}/>
                    <span className={classes.lang}>{selected?.name}</span>
                </Group>
                <AiOutlineDown size={16} className={classes.icon}/>
            </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
}

export default FrameThemeToggle;