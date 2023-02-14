import React from "react";
import {Box, Flex, Text} from "@mantine/core";

const SentimentTotalBox = () => {
    return <Box
        sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            textAlign: 'center',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm
        })}>
        <Flex
            gap="md"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap">
            <Text><b>Total</b></Text>
            <Text>100</Text>
        </Flex>
    </Box>
}

export default SentimentTotalBox;