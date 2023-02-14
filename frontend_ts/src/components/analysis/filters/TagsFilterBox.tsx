import React, {useState} from 'react';
import {Box, Flex, MultiSelect, Text} from '@mantine/core';
import {AiFillTag} from 'react-icons/ai';

const TagsFilterBox = () => {
    const [value, setValue] = useState<string[]>([]);

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
            <Text><b>Tags</b></Text>
            <MultiSelect
                icon={<AiFillTag/>}
                style={{flex: 'fit-content'}}
                transitionDuration={150}
                transition='pop-top-left'
                transitionTimingFunction='ease'
                placeholder='write tags'
                onChange={setValue}
                data={value}
                searchable
                creatable
                clearable
                getCreateLabel={(query) => `+ Add ${query}`}
                onCreate={(query) => {
                    setValue([...value, query]);
                    return query;
                }}
            />
        </Flex>
    </Box>
}

export default TagsFilterBox;