import React, {useContext} from "react";
import {Box, Flex, Loader, Text} from "@mantine/core";
import {SentimentContext} from "./index";

const SentimentTotalBox = () => {
    const sentimentData = useContext(SentimentContext);

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
            <Text><b>Processed</b></Text>
            {sentimentData
                ? <Text>{sentimentData?.processed}</Text>
                : <Loader size="sm" variant="dots"/>}
            <Text><b>Not processed</b></Text>
            {sentimentData
                ? <Text>{sentimentData?.notProcessed}</Text>
                : <Loader size="sm" variant="dots"/>}
        </Flex>
    </Box>
}

export default SentimentTotalBox;