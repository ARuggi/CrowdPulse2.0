import React from "react";
import {Box, Flex, SegmentedControl, Text} from "@mantine/core";

interface IProps {
    disableAllLabel: boolean | undefined
}

const AlgorithmFilterBox:React.FC<IProps> = ({disableAllLabel = false}) => {
    return <Box
        sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            textAlign: 'center',
            padding: theme.spacing.xl,
            borderRadius: theme.radius.md,
            height: '100%'
        })}>
        <Flex
            gap="md"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap">
            <Text><b>Algorithm</b></Text>
            <SegmentedControl
                style={{flex: 'fit-content'}}
                data={disableAllLabel ? [
                    {label: 'sent-it', value: 'sent-it'},
                    {label: 'feel-it', value: 'feel-it'}
                ] : [
                    {label: 'all', value: 'all'},
                    {label: 'sent-it', value: 'sent-it'},
                    {label: 'feel-it', value: 'feel-it'}
                ]}/>
        </Flex>
    </Box>
}

export default AlgorithmFilterBox;