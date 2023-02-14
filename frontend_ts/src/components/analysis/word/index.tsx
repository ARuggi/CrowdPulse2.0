import React from 'react';
import Filters from "../filters";

interface IProps {
    dbs: string[]
}

const WordTab:React.FC<IProps> = ({dbs}) => {
    return <>
        <Filters />
    </>
}

export default WordTab;