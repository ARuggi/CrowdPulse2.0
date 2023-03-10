import React from 'react';
import {Button} from '@mantine/core';

interface IProps {
    content: any
    disabled?: boolean
    onClick?: any
}

const TablePageButton:React.FC<IProps> = ({content, disabled = false, onClick = () => {}}) => {
    return <Button color='gray' radius='xs' size='xs' children={content} disabled={disabled} onClick={onClick}/>;
}

export default TablePageButton;