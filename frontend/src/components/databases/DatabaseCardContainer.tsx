import React, {useState} from 'react';

import DatabaseCard from './DatabaseCard';
import {Flex} from '@mantine/core';
import AnalyzeFloatingButton from './AnalyzeFloatingButton';
import SavingModal from './SavingModal';
import {DatabaseType} from '../../api/DatabasesResponse';

interface IProps {
    databasesData: DatabaseType[],
}

const DatabaseCardsContainer: React.FC<IProps> = ({databasesData}) => {

    const [selectedDatabases, setSelectedDatabases] = useState<Array<DatabaseType>>([])
    const [savingModalOpened, setSavingModalOpened] = useState(false);

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
        <Flex
            justify='center'
            wrap='wrap'
            gap='md'
            mt='2em'
        style={{marginBottom: '50px'}}>
            {databasesData
                .map((database: DatabaseType) =>
                    <DatabaseCard
                        key={database.name}
                        database={database}
                        onClick={() => toggleDatabase(database)}
                        isSelected={selectedDatabases.find(d => d.name === database.name) !== undefined}
                    />
                )}
        </Flex>
        <Flex justify='center'>
            <AnalyzeFloatingButton
                disabled={selectedDatabases.length === 0}
                onClick={() => setSavingModalOpened(true)}/>
            <SavingModal
                opened={savingModalOpened}
                onClose={() => setSavingModalOpened(false)}
                selectedDatabases={selectedDatabases.sort((s1, s2) => s1.name.localeCompare(s2.name))}
            />
        </Flex>
    </>
}

export default DatabaseCardsContainer;