import React, {CSSProperties} from 'react';
import {useTranslation} from 'react-i18next';
import {
    Box,
    Divider,
    Flex,
    Grid,
    LoadingOverlay,
    Spoiler,
    Text
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';


import {TbFilter, TbFilterOff} from 'react-icons/tb';
import {AiFillTag, AiOutlineUser} from 'react-icons/ai';
import {GrTextAlignCenter} from 'react-icons/gr';
import {HiHashtag} from 'react-icons/hi';
import {BsLock} from 'react-icons/bs';

import AlgorithmFilterBox from './AlgorithmFilterBox';
import SentimentFilterBox from './SentimentFilterBox';
import EmotionFilterBox from './EmotionFilterBox';
import HateSpeechFilterBox from './HateSpeechFilterBox';
import TypeFilterBox from './TypeFilterBox';
import MapTypeFilterBox from './MapTypeFilterBox';
import DateFilterBox from './DateFilterBox';
import MultiSelectionFilterBox from './MultiSelectionFilterBox';

interface IProps {
    lock: boolean,
    divider?: boolean,
    style?: CSSProperties
    filters?: {
        showAlgorithm?: boolean,
        algorithm?: {
            disableAllLabel?: boolean
        }
        showSentiment?: boolean,
        showEmotion?: boolean,
        showHateSpeech?: boolean,
        showType?: boolean,
        showMapType?: boolean,
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
    showEmotion: false,
    showHateSpeech: false,
    showType: true,
    showMapType: false,
    showDataRangePicker: true,
    showTags: true,
    showProcessedText: true,
    showHashTags: true,
    showUsernames: true
}

const Filters:React.FC<IProps> = ({lock, divider = true, style, filters = defaultFilters}) => {
    const { t } = useTranslation();
    const mediaQueryLg = useMediaQuery('(min-width: 1200px)');
    const mediaQueryMd = useMediaQuery('(min-width: 992px)');
    const maxHeight = mediaQueryLg ? 1000 : 0;

    return <>
        <Spoiler
            transitionDuration={500}
            maxHeight={maxHeight}
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
                    })}
                    children={<TbFilter color={'#1971c2'}/>}/>}
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
                    })}
                    children={<TbFilterOff color={'#1971c2'}/>}/>}>
            <LoadingOverlay
                loader={<Flex gap='md' justify='center' align='center' direction='row' wrap='wrap'>
                    <BsLock size={50}/>
                    <Text>{t('tab.filters.awaitingCompletion')}</Text>
                </Flex>}
                style={{borderRadius: '2%', margin: '1%'}}
                visible={lock}
                overlayBlur={5}
                zIndex={3}/>
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

                    {filters?.showEmotion &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <EmotionFilterBox/>
                        </Grid.Col>}

                    {filters?.showHateSpeech &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <HateSpeechFilterBox/>
                        </Grid.Col>}

                    {filters?.showType &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <TypeFilterBox/>
                        </Grid.Col>}

                    {filters?.showMapType &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <MapTypeFilterBox/>
                        </Grid.Col>}
                    
                    {filters?.showDataRangePicker &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <DateFilterBox/>
                        </Grid.Col>}

                    {filters?.showTags &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <MultiSelectionFilterBox
                                propertyName={'tags'}
                                label={t('tab.filters.tags')}
                                placeholder={t('tab.filters.tagsPlaceholder')}
                                icon={<AiFillTag/>}/>
                        </Grid.Col>}

                    {filters?.showProcessedText &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <MultiSelectionFilterBox
                                propertyName={'processedText'}
                                label={t('tab.filters.processedText')}
                                placeholder={t('tab.filters.processedTextPlaceholder')}
                                icon={<GrTextAlignCenter/>}/>
                        </Grid.Col>}

                    {filters?.showHashTags &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <MultiSelectionFilterBox
                                propertyName={'hashtags'}
                                label={t('tab.filters.hashtags')}
                                placeholder={t('tab.filters.hashtagsPlaceholder')}
                                icon={<HiHashtag/>}/>
                        </Grid.Col>}

                    {filters?.showUsernames &&
                        <Grid.Col span={mediaQueryMd ? 4 : 8}>
                            <MultiSelectionFilterBox
                                propertyName={'usernames'}
                                label={t('tab.filters.usernames')}
                                placeholder={t('tab.filters.usernamesPlaceholder')}
                                icon={<AiOutlineUser/>}/>
                        </Grid.Col>}

                </Grid>
            </Flex>
        </Spoiler>
        {divider && <Divider my='md' size='md'/>}
    </>
}

export default Filters;