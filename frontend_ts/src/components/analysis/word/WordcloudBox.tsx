import React, {useContext, useEffect} from 'react';
import {WordContext} from './index';
import ReactWordcloud, {Word} from 'react-wordcloud';
import {WordResponse} from '../../../api/WordResponse';
import {Box} from '@mantine/core';

const WORDCLOUD_MAX_ELEMENTS = 50;

const WordcloudBox = () => {

    const wordData = useContext<WordResponse | null>(WordContext);
    const words: Word[] = [];

    useEffect(() => {

        words.splice(0); // remove all elements from the array.
        let count = 0;

        for (const current of wordData || []) {

            if (count >= WORDCLOUD_MAX_ELEMENTS) {
                break;
            }

            const obj = current as unknown as { word: string, count: number };
            words.push({ text: obj.word, value: obj.count });
            count++;
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
        <ReactWordcloud
            words={words}
            options={{
                fontFamily: 'monospace',
                rotations: 1,
                rotationAngles: [0, 0],
                fontSizes: [20, 60]
            }}/>
    </Box>
}

export default WordcloudBox;