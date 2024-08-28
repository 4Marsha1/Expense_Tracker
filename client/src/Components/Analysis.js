import React, { useEffect, useState } from 'react'
import { EXPENSE_TYPES } from '../constants'

import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import BasicPie from './PieChart';

dayjs.extend(quarterOfYear);

const Analysis = ({ expenses }) => {
    const [currentTab, setCurrentTab] = useState('Daily')

    const getStats = (expenses) => {
        return (expenses.reduce((acc, expense) => {
            if (!acc[expense.expenseType]) {
                acc[expense.expenseType] = 0;
            }
            acc[expense.expenseType] += parseFloat(expense.amount);
            return acc;
        }, {}))
    };

    const getComparisonData = (currentTab) => {
        const today = dayjs();
        const yesterday = today.subtract(1, 'day');
        const thisMonth = today.startOf('month');
        const lastMonth = thisMonth.subtract(1, 'month');
        const thisQuarter = today.startOf('quarter');
        const lastQuarter = thisQuarter.subtract(1, 'quarter');

        switch (currentTab) {
            case 'Daily':
                return {
                    current: getStats(expenses.filter((item) => dayjs(item.date).isSame(today, 'day'))),
                    previous: getStats(expenses.filter((item) => dayjs(item.date).isSame(yesterday, 'day'))),
                };
            case 'Monthly':
                return {
                    current: getStats(expenses.filter((item) => dayjs(item.date).isSame(thisMonth, 'month'))),
                    previous: getStats(expenses.filter((item) => dayjs(item.date).isSame(lastMonth, 'month'))),
                };
            case 'Quarterly':
                return {
                    current: getStats(expenses.filter((item) => dayjs(item.date).isSame(thisQuarter, 'quarter'))),
                    previous: getStats(expenses.filter((item) => dayjs(item.date).isSame(lastQuarter, 'quarter'))),
                };
            default:
                return { current: {}, previous: {} };
        }
    };

    const [comparisonData, setComparisonData] = useState({ current: [], previous: [] });

    useEffect(() => {
        const data = getComparisonData(currentTab);
        setComparisonData(data);
    }, [currentTab]);

    return (
        <div className='px-4 flex flex-col gap-6'>
            <div className='flex gap-6'>
                {['Daily', 'Monthly', 'Quarterly'].map((item, idx) => <div className={`${currentTab === item ? 'bg-slate-500' : 'bg-slate-700'} px-4 py-1 rounded-md shadow-lg font-bold text-white cursor-pointer`} onClick={() => setCurrentTab(item)} key={idx}>{item}</div>)}
            </div>
            <div className='flex gap-2 flex-wrap'>
                {EXPENSE_TYPES.map((item, idx) => <div className='basis-1/4 flex flex-col gap-2 bg-sky-200 p-4 rounded-md shadow-lg' key={idx}>
                    <span className='font-medium text-sm'>{item}</span>
                    <BasicPie data={(comparisonData.current[item] && comparisonData.previous[item]) ? [
                        {
                            id: 0, value: comparisonData.current[item] ? comparisonData.current[item] : 0, label: 'Current'
                        }, {
                            id: 1, value: comparisonData.previous[item] ? comparisonData.previous[item] : 0, label: 'Previous'
                        }
                    ] : comparisonData.current[item] ? [
                        {
                            id: 0, value: comparisonData.current[item] ? comparisonData.current[item] : 0, label: 'Current'
                        }
                    ] : comparisonData.previous[item] ? [
                        {
                            id: 1, value: comparisonData.previous[item] ? comparisonData.previous[item] : 0, label: 'Previous'
                        }
                    ] : []} />
                </div>)}
            </div>
        </div>
    )
}

export default Analysis
