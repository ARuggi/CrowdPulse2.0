import React from "react";
import {RingProgress, Text} from "@mantine/core";

const SentimentCakeChart = () => {
    return  <RingProgress
        size={250}
        thickness={30}
        label={
            <Text size="xs" align="center" px="xs" sx={{pointerEvents: 'none'}}>
                <b>Percentage</b>
            </Text>
        }
        sections={[
            {value: 50, color: '#ffc234', tooltip: 'Positive, sentiments: 50%'},
            {value: 25, color: '#059bff', tooltip: 'Positive, sentiments: 25%'},
            {value: 25, color: '#ff4069',  tooltip: 'Positive, sentiments: 25%'}
        ]}/>
}

export default SentimentCakeChart;