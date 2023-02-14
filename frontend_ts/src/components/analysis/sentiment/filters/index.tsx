import React, {CSSProperties} from 'react';
import {Flex, Grid} from '@mantine/core';
import AlgorithmFilterBox from "./AlgorithmFilterBox";
import DateFilterBox from "./DateFilterBox";
import TagsFilterBox from "./TagsFilterBox";
import {useMediaQuery} from "@mantine/hooks";
import ProcessedTextFilterBox from "./ProcessedTextFilterBox";
import HashtagsFilterBox from "./HashtagsFilterBox";
import UsernamesFilterBox from "./UsernamesFilterBox";

interface IProps {
    style: CSSProperties
}

const SentimentFilters:React.FC<IProps> = ({style}) => {
    const mediaQueryMd = useMediaQuery('(min-width: 992px)');

    return <Flex
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
}

export default SentimentFilters;