import React, {useContext} from "react";
import {Loader, RingProgress, Text} from "@mantine/core";
import {SentimentContext} from "./index";

const SentimentCakeChart = () => {
    const sentimentData = useContext(SentimentContext);

    if (!sentimentData) {
        return <RingProgress
            size={250}
            thickness={30}
            label={
                <Text size="xs" align="center" px="xs" sx={{pointerEvents: 'none'}}>
                    <Loader size="xl" variant="bars"/>
                </Text>
            }
            sections={[
                {value: 100, color: 'gray', tooltip: 'loading...'}
            ]}/>
    }

    const values = {
        positive: sentimentData ? sentimentData.percentages.positive : 0,
        neutral: sentimentData ? sentimentData.percentages.neutral : 0,
        negative: sentimentData ? sentimentData.percentages.negative : 0
    };

    return <RingProgress
        size={250}
        thickness={30}
        label={
            <Text size="xs" align="center" px="xs" sx={{pointerEvents: 'none'}}>
                <b>Percentage</b>
            </Text>
        }
        sections={[
            {value: values.positive, color: '#ffc234', tooltip: `Positive: ${values.positive}%`},
            {value: values.neutral, color: '#059bff', tooltip: `Neutral: ${values.neutral}%`},
            {value: values.negative, color: '#ff4069',  tooltip: `Negative: ${values.negative}%`}
        ]}/>
}

export default SentimentCakeChart;