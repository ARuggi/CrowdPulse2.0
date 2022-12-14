import React from 'react';
import {TweetDatabasesData, DatabaseType} from '../requests/tweet/TweetDatabasesRequest';
import {useTranslation} from "react-i18next";

export type Content = {
    tweetDatabasesData: TweetDatabasesData;
}

function Welcome(content: Content) {

    const databaseItem = (database: DatabaseType): JSX.Element  => {
        return (
            <div className="col-sm-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{database.name}</h5>
                        <p className="card-text">Empty: {database.empty ? "true" : "false"}, {database.sizeOnDisk} Kb</p>
                    </div>
                </div>
            </div>
        );
    }

    const {t} = useTranslation();
    return (
        <div id="welcome">
            <h1>{t('welcome')}</h1>
            <div className="container border border-dark rounded w-100 p-3">
                <h2>{t('welcomeSelectDatabase')}</h2>
                <div className="row">
                    {content.tweetDatabasesData.databases.map((database: DatabaseType) => {
                        return databaseItem(database);
                    })}
                </div>
            </div>
        </div>
    );
}

export default Welcome;