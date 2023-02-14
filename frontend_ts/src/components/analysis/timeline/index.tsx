import React from 'react';
import Filters from "../filters";

interface IProps {
    dbs: string[]
}

const TimelineTab:React.FC<IProps> = ({dbs}) => {
    return <>
        <Filters />
    </>
}

export default TimelineTab;