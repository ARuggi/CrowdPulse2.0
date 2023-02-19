// noinspection DuplicatedCode

import React, {useContext, useEffect, useState} from 'react';
import {Box, Flex, MultiSelect, Switch} from '@mantine/core';
import {AiFillTag} from 'react-icons/ai';
import {FiltersContext} from '../index';

const TagsFilterBox = () => {
    const [values, setValues] = useState<string[]>([]);
    const [enabled, setEnabled] = useState(true);
    const {filters, setFilters} = useContext(FiltersContext);

    useEffect(() => {

        if (filters) {
            const newFilters = {...filters, tags: enabled ? values : undefined};
            setFilters(newFilters);
        }

    }, [values]);

    const onChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnabled(event.currentTarget.checked);
        setValues([...values]);
    }

    const onChangeValues = (values: string[]) => {
        setValues(values);
    }

    return <Box
        sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            textAlign: 'center',
            padding: theme.spacing.xl,
            borderRadius: theme.radius.md,
            height: '100%'
        })}>
        <Flex
            gap='md'
            justify='center'
            align='center'
            direction='row'
            wrap='wrap'>
            <Switch
                onLabel="ON"
                offLabel="OFF"
                defaultChecked={true}
                onChange={onChangeSwitch}
                label={<b>Tags</b>}
            />
            <MultiSelect
                icon={<AiFillTag/>}
                style={{flex: 'fit-content'}}
                transitionDuration={150}
                transition='pop-top-left'
                transitionTimingFunction='ease'
                placeholder='write tags'
                searchable
                creatable
                clearable
                disabled={!enabled}
                onChange={onChangeValues}
                data={values}
                getCreateLabel={(query) => `+ Add ${query}`}
                onCreate={(query) => {
                    setValues([...values, query]);
                    return query;
                }}
            />
        </Flex>
    </Box>
}

export default TagsFilterBox;