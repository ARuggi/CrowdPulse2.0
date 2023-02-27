import React, {useContext, useState} from 'react';
import {Flex, Table, Loader, Box, Input, Text} from '@mantine/core';
import isEqual from 'lodash.isequal';

import {TablePreferencesContext, TweetListContext} from './index';
import {TweetsListResponse} from '../../../api/TweetsListResponse';

import {TbBrandPagekit} from 'react-icons/tb';
import {MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight} from 'react-icons/md';
import {BsArrowRight} from 'react-icons/bs';
import TablePageButton from './TablePageButton';
import {getHotkeyHandler} from '@mantine/hooks';
import {IoNavigateSharp} from 'react-icons/io5';

const TweetListTable = () => {
    const tweetListData = useContext<TweetsListResponse | null>(TweetListContext);
    const {tablePreferences, setTablePreferences} = useContext(TablePreferencesContext);
    const [pageSize, setPageSize] = useState(tablePreferences.pageSize);
    const [pageNavigation, setPageNavigation] = useState(tablePreferences.page);
    let maxPages = 1;

    if (tweetListData) {
        maxPages = Math.floor(tweetListData.total / tablePreferences.pageSize) + 1;
    }

    const rows = tweetListData?.values?.map((element, i) => (
        <tr key={element.text}>
            <td>{((tablePreferences.page - 1) * pageSize) + (i + 1)}</td>
            <td>{element.author}</td>
            <td>{element.text}</td>
            <td>{element.tags && element.tags.length > 0 ? element.tags.join(', ') : ''}</td>
            <td>{new Date(element.created_at).toUTCString()}</td>
            <td>{element.lang}</td>
        </tr>
    ));

    const triggerPageSizeEdit = () => {
        if (pageSize < 5) {
            setPageSize(5);
        } else {
            const newTablePreferences = {...tablePreferences, ...{pageSize: pageSize}};
            setTablePreferences(isEqual(tablePreferences, newTablePreferences) ? tablePreferences : newTablePreferences);
        }
    }

    const triggerPageNavigation = () => {
        if (pageNavigation < 0 || pageNavigation > maxPages) {
            setPageNavigation(tablePreferences.page);
        } else {
            const newTablePreferences = {...tablePreferences, ...{page: pageNavigation}};
            setTablePreferences(isEqual(tablePreferences, newTablePreferences) ? tablePreferences : newTablePreferences);
        }
    }

    const triggerChangePage = (page: number) => {
        const newTablePreferences = {...tablePreferences, ...{page: page}};
        setTablePreferences(isEqual(tablePreferences, newTablePreferences) ? tablePreferences : newTablePreferences);
    }

    return <>
        {
            tweetListData
                ? <>
                    <Table
                        striped
                        withBorder
                        withColumnBorders
                        highlightOnHover
                        horizontalSpacing='xl'
                        verticalSpacing='xs'>
                        <thead>
                        <tr>
                            <th>N.</th>
                            <th>Author</th>
                            <th>Text</th>
                            <th>Tags</th>
                            <th>Created At</th>
                            <th>Lang</th>
                        </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </Table>
                    <Box
                        sx={(theme) => ({
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                            textAlign: 'center',
                            padding: theme.spacing.xs})}>
                        <Flex
                            gap='xs'
                            justify='flex-start'
                            align='center'
                            direction='row'
                            wrap='wrap'>
                            <Text>Page size</Text>
                            <Input
                                style={{width: '60px'}}
                                icon={<TbBrandPagekit/>}
                                defaultValue={pageSize && pageSize > 0 ? pageSize : 0}
                                onChange={(event) => setPageSize(Number.parseInt(event.target.value))}
                                onKeyDown={getHotkeyHandler([['Enter', triggerPageSizeEdit]])}
                                variant='filled'
                                radius='xs'
                                size='xs'/>
                        </Flex>
                        <Flex
                            style={{marginTop: '-30px'}}
                            gap='xs'
                            justify='flex-end'
                            align='center'
                            direction='row'
                            wrap='wrap'>

                            <Text>Page {tablePreferences.page} of {maxPages}</Text>
                            {tablePreferences.page > 1 && <TablePageButton content={<MdOutlineKeyboardArrowLeft/>}
                                                                           onClick={() => triggerChangePage(tablePreferences.page - 1)}/>}

                            {Array
                                .from({length: (maxPages - tablePreferences.page > 6 ? 6 : maxPages - tablePreferences.page + 1)})
                                .map((_, i) => {
                                    const key = 'table-page-button-' + i;
                                    return <TablePageButton
                                        key={key}
                                        disabled={i === 0}
                                        content={<>{tablePreferences.page + i}</>}
                                        onClick={() => triggerChangePage(tablePreferences.page + i)}/>
                                })}
                            {(maxPages - tablePreferences.page) > 6
                                && <><BsArrowRight/><TablePageButton
                                    content={<i>{maxPages}</i>}
                                    onClick={() => triggerChangePage(maxPages)}/></>}

                            <TablePageButton
                                content={<MdOutlineKeyboardArrowRight/>}
                                onClick={() => triggerChangePage(tablePreferences.page + 1)}/>
                            <Input
                                style={{width: '80px'}}
                                icon={<IoNavigateSharp/>}
                                value={pageNavigation && pageNavigation > 0 ? pageNavigation : 0}
                                onChange={(event) => setPageNavigation(Number.parseInt(event.target.value))}
                                onKeyDown={getHotkeyHandler([['Enter', triggerPageNavigation]])}
                                variant='filled'
                                radius='xs'
                                size='xs'/>
                        </Flex>
                    </Box>
                </>
                : <Flex
                    style={{marginTop: '20%'}}
                    gap='md'
                    justify='center'
                    align='center'
                    direction='row'
                    wrap='wrap'>
                    <Loader size='xl' variant='dots'/>
                </Flex>
        }
    </>
}

export default TweetListTable;