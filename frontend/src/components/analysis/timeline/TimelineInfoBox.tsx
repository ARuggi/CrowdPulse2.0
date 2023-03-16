import React, {useContext} from 'react';
import {Box, Flex, Loader, Text} from '@mantine/core';
import {TimelineContext} from './index';
import {TweetsTimelineResponse} from '../../../api/TweetsTimelineResponse';
import {useTranslation} from "react-i18next";

const countTweets = (response: TweetsTimelineResponse) => {
    let count = 0;

    for (const current of response) {
        count += current.count;
    }

    return count;
}

const calcAVG = (response: TweetsTimelineResponse) => {

    if (response.length > 0) {
        return (countTweets(response) / response.length).toFixed(2);
    }

    return 0;
}

const TimelineInfoBox = () => {
    const { t } = useTranslation();
    const timelineData = useContext<TweetsTimelineResponse | null>(TimelineContext);

    return <Box
        sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            textAlign: 'center',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm
        })}>
        <Flex
            gap='md'
            justify='center'
            align='center'
            direction='row'
            wrap='wrap'>
            <Text><b>{t('tab.timeline.tweets')}</b></Text>
            {timelineData
                ? <Text>{countTweets(timelineData)}</Text>
                : <Loader size='sm' variant='dots'/>}
            <Text><b>{t('tab.timeline.avg')}</b></Text>
            {timelineData
                ? <Text>{calcAVG(timelineData)}</Text>
                : <Loader size='sm' variant='dots'/>}
        </Flex>
    </Box>
}

export default TimelineInfoBox;