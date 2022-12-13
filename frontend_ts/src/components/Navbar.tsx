import React from 'react';

import {withTranslation, WithTranslation} from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import {availableLanguages} from "../i18n";

class Navbar extends React.Component<WithTranslation> {

    constructor(props: any) {
        super(props);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
    }

    render() {
        const {t} = this.props;
        return(
            <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1">{t('projectName')}</span>
                </div>
                <div className="collapse navbar-collapse float-end" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown-center dropstart">
                            {this.navLanguageIcon()}
                            <ul className="dropdown-menu dropdown-menu-dark" style={{paddingLeft: "10px"}}>
                                {this.dropMenuLanguages()}
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }

    navLanguageIcon(): JSX.Element {
        const {t} = this.props;
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

    dropMenuLanguages(): JSX.Element {
        const {t} = this.props;
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
                                onClick={() => this.handleLanguageChange(lang)}
                            />
                            <a className="dropdown-item"
                               href="#"
                               style={{marginRight: "10px"}}
                               onClick={() => this.handleLanguageChange(lang)}>{title}</a>
                        </li>
                    );
                })}
            </>
        );
    }

    handleLanguageChange(lang: string): void {
        const {i18n} = this.props;
        i18n.changeLanguage(lang)
            .then(() => {
                this.forceUpdate();
            });
    }
}

export default withTranslation()(Navbar);