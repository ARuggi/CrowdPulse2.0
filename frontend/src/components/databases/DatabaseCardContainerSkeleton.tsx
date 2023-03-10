import React from 'react';
import {Flex, Skeleton} from '@mantine/core';

const DatabaseCardContainerSkeleton: React.FC<any> = () => {
    return <>
        <Flex justify='center' wrap='wrap' gap='md' mt='2em'>
            <Skeleton height={330} width={200} radius='md'/>
            <Skeleton height={330} width={200} radius='md'/>
            <Skeleton height={330} width={200} radius='md'/>
        </Flex>
    </>
}

export default DatabaseCardContainerSkeleton;