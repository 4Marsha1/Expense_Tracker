import React, { useEffect, useState } from 'react'
import { EXPENSE_TYPES, MONTHS } from '../constants'

import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import BasicPie from './PieChart';

dayjs.extend(quarterOfYear);

const Analysis = ({ expenses }) => {
    const [currentTab, setCurrentTab] = useState('Daily')
    const [firstDay, setFirstDay] = useState('');
    const [secondDay, setSecondDay] = useState('');
    const [firstMonth, setFirstMonth] = useState('');
    const [secondMonth, setSecondMonth] = useState('');

    const getStats = (expenses) => {
        return (expenses.reduce((acc, expense) => {
            if (!acc[expense.expenseType]) {
                acc[expense.expenseType] = 0;
            }
            acc[expense.expenseType] += parseFloat(expense.amount);
            return acc;
        }, {}))
    };

    const getComparisonData = ({ currentTab, _firstDay = undefined, _secondDay = undefined, _firstMonth = undefined, _secondMonth = undefined }) => {
        const firstDay = dayjs(_firstDay) || dayjs();
        const secondDay = _secondDay || firstDay.subtract(1, 'day');
        const firstMonth = (_firstMonth && dayjs(_firstMonth).startOf('month')) || firstDay.startOf('month');
        const secondMonth = (_secondMonth && dayjs(_secondMonth).startOf('month')) || firstMonth.subtract(1, 'month');


        switch (currentTab) {
            case 'Daily':
                return {
                    current: getStats(expenses.filter((item) => dayjs(item.date).isSame(firstDay, 'day'))),
                    previous: getStats(expenses.filter((item) => dayjs(item.date).isSame(secondDay, 'day'))),
                };
            case 'Monthly':
                return {
                    current: getStats(expenses.filter((item) => dayjs(item.date).isSame(firstMonth, 'month'))),
                    previous: getStats(expenses.filter((item) => dayjs(item.date).isSame(secondMonth, 'month'))),
                };
            default:
                return { current: {}, previous: {} };
        }
    };

    const [comparisonData, setComparisonData] = useState({ current: [], previous: [] });

    useEffect(() => {
        const data = getComparisonData({ currentTab: currentTab });
        setComparisonData(data);
    }, [currentTab]);

    return (
        <div className='px-4 flex flex-col gap-6'>
            <div className='flex gap-6'>
                {['Daily', 'Monthly'].map((item, idx) => <div className={`${currentTab === item ? 'bg-slate-500' : 'bg-slate-700'} px-4 py-1 rounded-md shadow-lg font-bold text-white cursor-pointer`} onClick={() => setCurrentTab(item)} key={idx}>{item}</div>)}
            </div>
            {currentTab === 'Daily' && <div>
                <input type="date" value={firstDay} onChange={(e) => setFirstDay(e.target.value)} />
                <input type="date" value={secondDay} onChange={(e) => setSecondDay(e.target.value)} />
                <button onClick={() => {
                    const data = getComparisonData({ currentTab: 'Daily', _firstDay: firstDay, _secondDay: secondDay })
                    setComparisonData(data)
                }}>Compare</button>
            </div>}
            {currentTab === 'Monthly' && <div>
                <select value={firstMonth} onChange={(e) => setFirstMonth(e.target.value)}>
                    {MONTHS.map(month => <option value={month.value}>{month.month}</option>)}
                </select>
                <select value={secondMonth} onChange={(e) => setSecondMonth(e.target.value)}>
                    {MONTHS.map(month => <option value={month.value}>{month.month}</option>)}
                </select>
                <button onClick={() => {
                    const data = getComparisonData({ currentTab: 'Monthly', _firstMonth: firstMonth, _secondMonth: secondMonth })
                    setComparisonData(data)
                }}>Compare</button>
            </div>}
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
