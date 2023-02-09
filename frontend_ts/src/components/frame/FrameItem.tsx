import React from 'react';
import {UnstyledButton} from '@mantine/core';

interface IProps {
    selected: boolean;
    onClick: any;
    content: any;
}

const buttonTheme = (theme: any) => ({
    display: 'block',
    width: '100%',
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
        backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
});

const FrameItem:React.FC<IProps> = ({selected, onClick, content}) => {
    return <UnstyledButton
        sx={buttonTheme}
        onClick={onClick}
        fw={selected ? 700 : 300}>
        {content}
    </UnstyledButton>

}

export default FrameItem;