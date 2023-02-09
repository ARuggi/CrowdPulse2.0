import {Alert, Text} from '@mantine/core';
import {FaExclamationCircle} from 'react-icons/fa';
import {GiCactus} from 'react-icons/gi';

const NotFound = () => {

    return<Alert icon={<FaExclamationCircle />} title='404' color='red'>
        <Text>Page not found <GiCactus/></Text>
    </Alert>
}

export default NotFound;
