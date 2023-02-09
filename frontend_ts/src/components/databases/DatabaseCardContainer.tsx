import React, {useState} from 'react';

import DatabaseCard from './DatabaseCard';
import {Flex} from '@mantine/core';

interface IProps {
    databasesData: any,
}

const DatabaseCardsContainer: React.FC<IProps> = ({databasesData}) => {
    const [selectedDatabases, setSelectedDatabases] = useState<Array<any>>([])

    const addDatabase = (database: any) => {
        setSelectedDatabases((currentSelected: Array<any>) => ([...currentSelected, database]));
    }

    const removeDatabase = (database: any) => {
        setSelectedDatabases((currentSelected: Array<any>) => currentSelected.filter(d => d.name !== database.name));
    }

    const toggleDatabase = (database: any) => {
        if (selectedDatabases.find(d => d.name === database.name)) {
            removeDatabase(database);
        } else {
            addDatabase(database);
        }
    }

    return <>
        <Flex justify='center' wrap='wrap' gap='md' mt='2em'>
            {databasesData
                .databases
                .map((database: any) =>
                    <DatabaseCard
                        key={database.name}
                        database={database}
                        onClick={() => toggleDatabase(database)}
                        isSelected={selectedDatabases.find(d => d.name === database.name)}
                    />
                )}
        </Flex>
    </>
}

export default DatabaseCardsContainer;