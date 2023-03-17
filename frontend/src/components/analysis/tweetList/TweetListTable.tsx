import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import isEqual from 'lodash.isequal';

import {Flex, Table, Loader, Box, Input, Text, ScrollArea} from '@mantine/core';
import {getHotkeyHandler, useMediaQuery} from '@mantine/hooks';

import {BsArrowRight} from 'react-icons/bs';
import {TbBrandPagekit} from 'react-icons/tb';
import {IoNavigateSharp} from 'react-icons/io5';
import {MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight} from 'react-icons/md';

import {TablePreferencesContext, TweetListContext} from './TweetListTab';
import {TweetsListResponse} from '../../../api/TweetsListResponse';
import TablePageButton from './TablePageButton';


const TweetListTable = () => {
    const { t } = useTranslation();
    const tweetListData = useContext<TweetsListResponse | null>(TweetListContext);
    const {tablePreferences, setTablePreferences} = useContext(TablePreferencesContext);

    const mediaQuery = useMediaQuery('(max-width: 920px)');

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
                    <ScrollArea>
                        <Table
                            striped
                            withBorder
                            withColumnBorders
                            highlightOnHover
                            horizontalSpacing='xl'
                            verticalSpacing='xs'>
                            <thead>
                            <tr>
                                <th>{t('tab.tweetList.index')}</th>
                                <th>{t('tab.tweetList.author')}</th>
                                <th>{t('tab.tweetList.text')}</th>
                                <th>{t('tab.tweetList.tags')}</th>
                                <th>{t('tab.tweetList.createdAt')}</th>
                                <th>{t('tab.tweetList.lang')}</th>
                            </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </Table>
                    </ScrollArea>
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
                            <Text>{t('tab.tweetList.pageSize')}</Text>
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
                            style={mediaQuery ? {marginTop: '10px'} : {marginTop: '-30px'}}
                            gap='xs'
                            justify='flex-end'
                            align='center'
                            direction='row'
                            wrap='wrap'>

                            <Text>
                                {t('tab.tweetList.pageOf')
                                    ?.replace('%current_page%', `${tablePreferences.page}`)
                                    ?.replace('%max_page%', `${maxPages}`)}
                            </Text>
                            {tablePreferences.page > 1 && <TablePageButton content={<MdOutlineKeyboardArrowLeft/>}
                                                                           onClick={() => triggerChangePage(tablePreferences.page - 1)}/>}

                            {Array
                                .from({length: (maxPages - tablePreferences.page > 2 ? 2 : maxPages - tablePreferences.page + 1)})
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

                            {tablePreferences.page < maxPages && <TablePageButton content={<MdOutlineKeyboardArrowRight/>}
                                                                                  onClick={() => triggerChangePage(tablePreferences.page + 1)}/>}
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