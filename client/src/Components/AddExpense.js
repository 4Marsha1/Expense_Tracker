import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { EXPENSE_TYPES } from '../constants';

const AddExpense = ({ getExpenses, isEditing, setIsEditing }) => {
    const [newExpense, setNewExpense] = useState({ type: "", date: "", amount: "", remarks: "" });
    const [id, setId] = useState('')

    useEffect(() => {
        if (isEditing.date) {
            setNewExpense({
                type: isEditing.expenseType,
                date: new Date(isEditing.date).toISOString().split('T')[0],
                amount: isEditing.amount,
                remarks: isEditing.remarks ? isEditing.remarks : ""
            })
            setId(isEditing.id)
        }
    }, [isEditing])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExpense((prev) => ({ ...prev, [name]: value }));
    };

    const addExpense = async () => {
        if (newExpense.type === '' || newExpense.date === '' || newExpense.amount === '') {
            return
        }
        try {
            if (id) {
                await axios.put(`http://localhost:8080/expenses/${id}`, {
                    "expenseType": newExpense.type,
                    "date": newExpense.date,
                    "amount": newExpense.amount,
                    "remarks": newExpense.remarks
                })
                getExpenses()
                setNewExpense({ type: "", date: "", amount: "", remarks: "" });
                setIsEditing({})
                setId('')
            } else {
                await axios.post('http://localhost:8080/expenses', {
                    "expenseType": newExpense.type,
                    "date": newExpense.date,
                    "amount": newExpense.amount,
                    "remarks": newExpense.remarks
                })
                getExpenses()
                setNewExpense({ type: "", date: "", amount: "", remarks: "" });
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            <div className='p-4 bg-slate-300 border border-slate-400 rounded-md shadow-lg text-black'>
                <div className='flex gap-2 items-center'>
                    <div className="mb-4 w-full">
                        <label className="block text-gray-800 text-sm font-semibold">Expense Type</label>
                        <select
                            name="type"
                            value={newExpense.type}
                            onChange={handleInputChange}
                            className="w-full rounded h-[32px]"
                        >
                            <option value="">-</option>
                            {EXPENSE_TYPES.map(exp => <option value={exp} key={exp}>{exp}</option>)}
                        </select>
                    </div>
                    <div className="mb-4 w-full">
                        <label className="block text-gray-800 text-sm font-semibold">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={newExpense.date}
                            onChange={handleInputChange}
                            className="w-full p-1 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <div className='flex gap-2 items-center'>
                    <div className="mb-4 w-full">
                        <label className="block text-gray-800 text-sm font-semibold">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={newExpense.amount}
                            onChange={handleInputChange}
                            className="w-full p-1 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4 w-full">
                        <label className="block text-gray-800 text-sm font-semibold">Remarks</label>
                        <input
                            type="text"
                            name="remarks"
                            value={newExpense.remarks}
                            onChange={handleInputChange}
                            className="w-full p-1 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <button
                    onClick={addExpense}
                    className="bg-slate-600 text-white py-1 font-bold rounded-md w-full shadow-md"
                >
                    {id ? 'Edit' : 'Add'} Expense
                </button>
            </div>
        </>
    )
}

export default AddExpense
