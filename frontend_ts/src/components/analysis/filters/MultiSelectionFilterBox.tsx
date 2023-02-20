import React, {useContext, useEffect, useState} from 'react';
import {Box, Flex, MultiSelect, Switch} from '@mantine/core';
import {FiltersContext} from '../index';
import isEqual from 'lodash.isequal';

interface IProps {
    propertyName: string,
    label: string,
    placeholder: string
    icon: any,

}

const MultiSelectionFilterBox:React.FC<IProps> = ({propertyName, label, placeholder, icon}) => {
    const [values, setValues] = useState<string[]>([]);
    const [enabled, setEnabled] = useState(true);
    const {filters, setFilters} = useContext(FiltersContext);

    useEffect(() => {
        if (filters) {
            const newValues = values.length > 0 ? values : undefined;
            const newFilters = {...filters, [propertyName]: enabled ? newValues : undefined};
            setFilters(isEqual(filters, newFilters) ? filters : newFilters);
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
                onLabel='ON'
                offLabel='OFF'
                defaultChecked={true}
                onChange={onChangeSwitch}
                label={<b>{label}</b>}
            />
            <MultiSelect
                icon={icon}
                style={{flex: 'fit-content'}}
                transitionDuration={150}
                transition='pop-top-left'
                transitionTimingFunction='ease'
                placeholder={placeholder}
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

export default MultiSelectionFilterBox;