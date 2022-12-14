import React from 'react';

import {useTranslation} from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import {availableLanguages} from "../i18n";

function Navbar() {

    const dropMenuLanguages = (): JSX.Element => {
        return (
            <>
                {availableLanguages.map((lang, i) => {
                    const countryCode = t('countryCode', {lng: lang});
                    const title = t('language', {lng: lang, defaultValue: ""})!;
                    return (
                        <li key={i} style={{display: "flex"}}>
                            <ReactCountryFlag
                                countryCode={countryCode}
                                svg
                                style={{
                                    width: '2em',
                                    height: '2em',
                                }}
                                title={title}
                                onClick={() => handleLanguageChange(lang)}
                            />
                            <a className="dropdown-item"
                               href="#"
                               style={{marginRight: "10px"}}
                               onClick={() => handleLanguageChange(lang)}>{title}</a>
                        </li>
                    );
                })}
            </>
        );
    }

    const navLanguageIcon = (): JSX.Element => {
        return (
            <a className="nav-link dropdown-toggle"
               href="#"
               role="button"
               data-bs-toggle="dropdown"
               aria-expanded="true">
                <ReactCountryFlag
                    countryCode={t("countryCode")}
                    svg
                    style={{
                        width: '2em',
                        height: '2em',
                    }}
                    title={t('language', {defaultValue: ""})!}
                />
            </a>
        );
    }

    const handleLanguageChange = (lang: string): void => {
        i18n.changeLanguage(lang).then(() => console.log(`language changed to '${lang}'`));
    };

    const {t, i18n} = useTranslation();

    return(
        <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
            <div className="container-fluid">
                <span className="navbar-brand mb-0 h1">{t('projectName')}</span>
            </div>
            <div className="collapse navbar-collapse float-end" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item dropdown-center dropstart">
                        {navLanguageIcon()}
                        <ul className="dropdown-menu dropdown-menu-dark" style={{paddingLeft: "10px"}}>
                            {dropMenuLanguages()}
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;