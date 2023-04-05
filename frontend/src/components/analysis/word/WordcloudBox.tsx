import React, {useContext, useEffect, useState} from 'react';
import {Box, Center, Loader} from '@mantine/core';

import ReactWordcloud, {Word} from 'react-wordcloud';
import {WordResponse} from '../../../api/WordResponse';
import {WordContext} from './index';

const WORDCLOUD_MAX_ELEMENTS = 50;

const WordcloudBox = () => {

    const wordData = useContext<WordResponse | null>(WordContext);
    const [words, setWords] = useState<Word[] | undefined>(undefined);

    useEffect(() => {
        if (wordData) {
            setWords((wordData as unknown as Word[]).slice(0, WORDCLOUD_MAX_ELEMENTS));
        } else if (words) {
            setWords(undefined);
        }
    }, [wordData]);

    return <Box style={{width: '80%'}}
                sx={(theme) => ({
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    textAlign: 'center',
                    padding: theme.spacing.xl,
                    borderRadius: theme.radius.md,
                    height: '100%'
                })}>
        {words
            ? <ReactWordcloud
                words={words.length > 0 ? words : [{text: 'no results :(', value: 1}]}
                options={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
                    rotations: 1,
                    rotationAngles: [0, 0],
                    fontSizes: [20, 60]
                }}/>
            : <Center><Loader size='xl' variant='bars' /></Center>}
    </Box>
}

export default WordcloudBox;