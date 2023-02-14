import React, {CSSProperties} from 'react';
import {Box, Divider, Flex, Grid, Spoiler} from '@mantine/core';
import AlgorithmFilterBox from "./AlgorithmFilterBox";
import DateFilterBox from "./DateFilterBox";
import TagsFilterBox from "./TagsFilterBox";
import {useMediaQuery} from "@mantine/hooks";
import ProcessedTextFilterBox from "./ProcessedTextFilterBox";
import HashtagsFilterBox from "./HashtagsFilterBox";
import UsernamesFilterBox from "./UsernamesFilterBox";
import {TbFilter, TbFilterOff} from "react-icons/tb";

interface IProps {
    divider?: boolean,
    style?: CSSProperties
}

const Filters:React.FC<IProps> = ({divider = true, style}) => {
    const mediaQueryMd = useMediaQuery('(min-width: 992px)');

    return <>
        <Spoiler
            maxHeight={0}
            showLabel={
                <Box
                    sx={(theme) => ({
                        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                        padding: theme.spacing.xs,
                        borderRadius: theme.radius.md,
                        cursor: 'pointer',
                        position: 'absolute',

                        '&:hover': {
                            backgroundColor:
                                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                        }
                    })}>
                    <TbFilter color={'#1971c2'}/>
                </Box>
            }
            hideLabel={
                <Box
                    sx={(theme) => ({
                        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                        textAlign: 'center',
                        padding: theme.spacing.xs,
                        borderRadius: theme.radius.md,
                        cursor: 'pointer',
                        position: 'absolute',

                        '&:hover': {
                            backgroundColor:
                                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                        }
                    })}>
                    <TbFilterOff color={'#1971c2'}/>
                </Box>
            }
            transitionDuration={500}>
            <Flex
                gap="md"
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
                style={{...style}}>
                <Grid justify='center' align='stretch' grow>
                    <Grid.Col span={4}><AlgorithmFilterBox/></Grid.Col>
                    <Grid.Col span={mediaQueryMd ? 4 : 8}><DateFilterBox/></Grid.Col>
                    <Grid.Col span={mediaQueryMd ? 4 : 8}><TagsFilterBox/></Grid.Col>
                    <Grid.Col span={mediaQueryMd ? 4 : 8}><ProcessedTextFilterBox/></Grid.Col>
                    <Grid.Col span={mediaQueryMd ? 4 : 8}><HashtagsFilterBox/></Grid.Col>
                    <Grid.Col span={mediaQueryMd ? 4 : 8}><UsernamesFilterBox/></Grid.Col>
                </Grid>
            </Flex>
        </Spoiler>
        {divider && <Divider my="md" size="md"/>}
    </>
}

export default Filters;