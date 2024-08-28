import React from 'react'

const Expenses = ({ expenses }) => {

    const getStats = () => {
        return (expenses.reduce((acc, expense) => {
            if (!acc[expense.expenseType]) {
                acc[expense.expenseType] = 0;
            }
            acc[expense.expenseType] += parseFloat(expense.amount);
            return acc;
        }, {}))
    };

    const getTotal = () => expenses.reduce((total, expense) => total + expense.amount, 0);

    return (
        <div className='w-full h-screen bg-slate-400 p-5 flex flex-col gap-4'>
            <span className='text-2xl font-bold'>Total Expenditure</span>
            <div className='flex flex-col gap-4'>
                {Object.entries(getStats()).map(([type, total]) => (
                    <div key={type} className='bg-slate-600 text-white flex justify-between items-center py-2 px-4 rounded-lg shadow-lg'>
                        <span className='font-semibold'>{type}</span>
                        <span className='font-medium'>₹{total.toFixed(2)}</span>
                    </div>
                ))}
                <div className='bg-gray-300 text-black flex justify-between items-center py-2 px-4 rounded-lg shadow-lg'>
                    <span className='font-bold'>Total</span>
                    <span className='font-bold'>₹{getTotal().toFixed(2)}</span>
                </div>
            </div>
        </div>
    )
}

export default Expenses
