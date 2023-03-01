import React from "react";
import {Box} from "@mantine/core";

interface IProps {
    regionName: string,
}

const HeatMapTooltip:React.FC<IProps> = ({regionName}) => {
    return <Box sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        textAlign: 'center'})}>
        {regionName}
    </Box>
}

export default HeatMapTooltip;