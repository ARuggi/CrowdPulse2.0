import React, {CSSProperties} from 'react';
import {Box, Divider, Flex, Grid, Spoiler} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {TbFilter, TbFilterOff} from 'react-icons/tb';

import AlgorithmFilterBox from './AlgorithmFilterBox';
import SentimentFilterBox from "./SentimentFilterBox";
import TypeFilterBox from './TypeFilterBox';
import DateFilterBox from './DateFilterBox';
import MultiSelectionFilterBox from "./MultiSelectionFilterBox";

import {AiFillTag, AiOutlineUser} from "react-icons/ai";
import {GrTextAlignCenter} from "react-icons/gr";
import {HiHashtag} from "react-icons/hi";

interface IProps {
    divider?: boolean,
    style?: CSSProperties
    filters?: {
        showAlgorithm?: boolean,
        algorithm?: {
            disableAllLabel?: boolean
        }
        showSentiment?: boolean,
        showType?: boolean,
        showDataRangePicker?: boolean,
        showTags?: boolean,
        showProcessedText?: boolean,
        showHashTags?: boolean,
        showUsernames?: boolean,
    }
}

const defaultFilters = {
    showAlgorithm: true,
    algorithm: {disableAllLabel: false},
    showSentiment: true,
    showType: true,
    showDataRangePicker: true,
    showTags: true,
    showProcessedText: true,
    showHashTags: true,
    showUsernames: true
}

const Filters:React.FC<IProps> = ({divider = true, style, filters = defaultFilters}) => {
    const mediaQueryLg = useMediaQuery('(min-width: 1200px)');
    const mediaQueryMd = useMediaQuery('(min-width: 992px)');

    return <>
        <Spoiler
            maxHeight={mediaQueryLg ? 1000 : 0}
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
                gap='md'
                justify='center'
                align='center'
                direction='column'
                wrap='wrap'
                style={{...style}}>
                <Grid justify='center' align='stretch' grow>

                    {filters?.showAlgorithm &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <AlgorithmFilterBox disableAllLabel={filters?.algorithm?.disableAllLabel}/>
                        </Grid.Col>}

                    {filters?.showSentiment &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <SentimentFilterBox/>
                        </Grid.Col>}

                    {filters?.showType &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <TypeFilterBox/>
                        </Grid.Col>}

                    {filters?.showDataRangePicker &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <DateFilterBox/>
                        </Grid.Col>}

                    {filters?.showTags &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <MultiSelectionFilterBox
                                propertyName={'tags'}
                                label={'Tags'}
                                icon={<AiFillTag/>}
                                placeholder={'write tags'}/>
                        </Grid.Col>}

                    {filters?.showProcessedText &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <MultiSelectionFilterBox
                                propertyName={'processedText'}
                                label={'Processed Text'}
                                icon={<GrTextAlignCenter/>}
                                placeholder={'write any word'}/>
                        </Grid.Col>}

                    {filters?.showHashTags &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <MultiSelectionFilterBox
                                propertyName={'hashtags'}
                                label={'Hashtags'}
                                icon={<HiHashtag/>}
                                placeholder={'write hashtags'}/>
                        </Grid.Col>}

                    {filters?.showUsernames &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <MultiSelectionFilterBox
                                propertyName={'usernames'}
                                label={'Usernames'}
                                icon={<AiOutlineUser/>}
                                placeholder={'write username'}/>
                        </Grid.Col>}

                </Grid>
            </Flex>
        </Spoiler>
        {divider && <Divider my='md' size='md'/>}
    </>
}

export default Filters;