import React from 'react';

import {useTranslation} from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import {availableLanguages} from "../i18n";
import {Nav, Navbar as NBar, NavDropdown} from "react-bootstrap";
import Container from "react-bootstrap/Container";

function handleLanguageChange(i18n: any, lang: string) {
    i18n.changeLanguage(lang).then(() => console.log(`language changed to '${lang}'`));
}

type LanguageMenuLangType = {
    lang: string;
    countryCode: string;
    title: string;
    onClick: any;
}

function NavbarLogoContainer(props: {title: string}) {
    const {title} = props;
    return (
        <Container fluid>
            <NBar.Brand className={"mb-0 h1"} href="/">{title}</NBar.Brand>
            <NBar.Toggle type={"button"}
                         aria-controls={"top-navbar-lang-menu"}
                         aria-expanded={"true"}
                         aria-label={"Toggle navigation"}>
            </NBar.Toggle>
        </Container>
    );
}

function NavbarLanguageMenuItem(props: {wrapper: LanguageMenuLangType}) {
    const {wrapper} = props;
    return (
        <NavDropdown.Item href="#"
                          style={{display: "flex"}}>
            <ReactCountryFlag svg
                              countryCode={wrapper.countryCode}
                              title={wrapper.title}
                              style={{width: '2em', height: '2em'}}
                              onClick={wrapper.onClick}
            />
            <div style={{marginLeft: "10px", marginTop: "3px"}}
                 onClick={wrapper.onClick}>{wrapper.title}</div>
        </NavDropdown.Item>
    );
}

function Navbar() {
    const {t, i18n} = useTranslation();

    return (
        <NBar bg={"dark"}
              expand={"lg"}
              id={"top-navbar"}>
            <NavbarLogoContainer title={t('projectName', {defaultValue: "CrowdPulse"})!}/>
            <NBar.Collapse id={"top-navbar-lang-menu"}>
                <Nav className={"navbar-nav me-auto dropstart mb-2 mb-lg-0"}
                     style={{display: "flex", alignItems: "end", paddingRight: "15px"}}>
                    <NavDropdown id={"top-navbar-lang-menu"}
                                 menuVariant={"dark"}
                                 style={{display: "contents"}}
                                 title={
                                     <ReactCountryFlag svg
                                                       countryCode={t("countryCode")}
                                                       style={{width: '2em', height: '2em'}}
                                                       title={t('language', {defaultValue: ""})!}/>
                                 }>

                        {availableLanguages.map(lang => {
                            return {
                                lang: lang,
                                countryCode: t('countryCode', {lng: lang}),
                                title: t('language', {lng: lang, defaultValue: ""})!,
                                onClick: () => handleLanguageChange(i18n, lang)
                            } as LanguageMenuLangType;
                        }).map(wrapper => {
                            return <NavbarLanguageMenuItem key={wrapper.lang} wrapper={wrapper}/>;
                        })}

                    </NavDropdown>
                </Nav>
            </NBar.Collapse>
        </NBar>
    );
}

export default Navbar;