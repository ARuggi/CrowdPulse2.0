import React from 'react';

import {useTranslation} from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import {availableLanguages} from "../i18n";
import {Nav, Navbar as NBar, NavDropdown} from "react-bootstrap";
import Container from "react-bootstrap/Container";

function handleLanguageChange(i18n: any, lang: string) {
    i18n.changeLanguage(lang).then(() => console.log(`language changed to '${lang}'`));
}

function Navbar() {
    const {t, i18n} = useTranslation();

    return (
        <NBar bg="dark" expand="lg">
            <Container fluid>
                <NBar.Brand className={"mb-0 h1"} href="/">{t('projectName')}</NBar.Brand>
                <NBar.Toggle type={"button"}
                             aria-controls={"navbarMenu"}
                             aria-expanded={"true"}
                             aria-label={"Toggle navigation"}>
                </NBar.Toggle>
            </Container>
            <NBar.Collapse id={"navbarMenu"}>
                <Nav className={"navbar-nav me-auto dropstart mb-2 mb-lg-0"}
                     style={{display: "flex", alignItems: "end", paddingRight: "15px"}}>
                    <NavDropdown id={"navbarMenu"}
                                 menuVariant={"dark"}
                                 style={{display: "contents"}}
                                 title={
                                     <ReactCountryFlag svg
                                                       countryCode={t("countryCode")}
                                                       style={{width: '2em', height: '2em'}}
                                                       title={t('language', {defaultValue: ""})!}/>
                                 }>
                        {availableLanguages.map((lang, i) => {
                            const countryCode = t('countryCode', {lng: lang});
                            const title = t('language', {lng: lang, defaultValue: ""})!;

                            return (
                                <NavDropdown.Item key={i}
                                                  href="#"
                                                  style={{display: "flex"}}>
                                    <ReactCountryFlag svg
                                                      countryCode={countryCode}
                                                      title={title}
                                                      style={{width: '2em', height: '2em'}}
                                                      onClick={() => handleLanguageChange(i18n, lang)}
                                    />
                                    <div style={{marginLeft: "10px", marginTop: "3px"}}
                                         onClick={() => handleLanguageChange(i18n, lang)}>{title}</div>
                                </NavDropdown.Item>
                            );
                        })}
                    </NavDropdown>
                </Nav>
            </NBar.Collapse>
        </NBar>
    );
}

export default Navbar;