import React from 'react';
import {
    Image,
    Text,
    Button,
    Card,
    Group,
    Center
} from '@mantine/core';
import {AiFillDatabase} from 'react-icons/ai';

interface IProps {
    database: any,
    onClick: () => void,
    isSelected: boolean
}

const DatabaseCard: React.FC<IProps> = ({database, onClick, isSelected}) => {
    return (
        <Card shadow='xl'
              p='xl'
              radius='md'
              withBorder onClick={onClick}
              style={{ cursor: 'pointer', width: '200px', height: '330px' }}>
            <Card.Section>
                <Center>
                    { database.info.icon && <Image src={`data:image/jpeg;base64,${database.info.icon}`} width='150px' height='150px' alt={database.name}/>}
                    {!database.info.icon && <AiFillDatabase size='150px' />}
                </Center>
                <Group position='center' mt='md' mb='xs'>
                    <Text weight={700}>{database.name}</Text>
                </Group>
            </Card.Section>

            <Text size='sm' color='dimmed'>
                <small><b>Release date</b>: {database.info.releaseDate ? database.info.releaseDate.toString() : 'N/D'}</small><br/>
                <small><b>Last update</b>: {database.info.lastUpdateDate ? database.info.lastUpdateDate.toString() : 'N/D'}</small><br/>
                <small><b>Version</b>: {database.info.version ? database.info.version : 'N/D'}</small>
            </Text>

            <Button variant='light' color={isSelected ? 'red' : 'green'} fullWidth mt='md' radius='md'>
                {isSelected ? 'Deselect' : 'Select'}
            </Button>
        </Card>
    );
}

export default DatabaseCard;