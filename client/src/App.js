import React, { useEffect, useState } from "react";
import AddExpense from "./Components/AddExpense";
import axios from "axios";
import Expenses from "./Components/Expenses";
import { TABS } from "./constants";
import { Link } from "react-router-dom";
import Analysis from "./Components/Analysis";
import exportFromJSON from 'export-from-json'

const App = () => {
    const [currentTab, setCurrentTab] = useState("Daily Expenses");

    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);

    const getExpenses = async () => {
        try {
            const res = await axios.get('http://localhost:8080/expenses')
            const data = await res.data
            setExpenses(data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getExpenses()
    }, [])

    useEffect(() => {
        if (expenses.length > 0 && currentTab) {
            switch (currentTab) {
                case 'Daily Expenses': setFilteredExpenses(expenses.filter(exp => (Number(exp.date.split('-')[2].split('T')[0]) === new Date().getDate() && Number(exp.date.split('-')[1]) === new Date().getMonth() + 1)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())); break;
                case 'Monthly Expenses': setFilteredExpenses(expenses.filter(exp => Number(exp.date.split('-')[1]) === (new Date().getMonth()) + 1).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())); break;
                case 'Lifetime Expenses': setFilteredExpenses(expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())); break;
                default: setFilteredExpenses(expenses)
            }
        } else {
            setFilteredExpenses([])
        }
    }, [expenses, currentTab])

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/expenses/${id}`)
            getExpenses()
        } catch (error) {
            console.log(error)
        }
    }

    const [isEditing, setIsEditing] = useState({});

    const [selectedExpenses, setSelectedExpenses] = useState(new Set());

    const handleCheckboxChange = (id) => {
        setSelectedExpenses(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

    const deleteAllSelected = async () => {
        try {
            await axios.post(`http://localhost:8080/expenses/bulk-delete`, Array.from(selectedExpenses))
            setSelectedExpenses(new Set())
            getExpenses()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex h-screen">
            <div className="w-1/4 bg-gray-800 text-white p-5 flex flex-col gap-4">
                <h2 className="text-2xl font-bold">Expense Tracker</h2>
                <ul>
                    {TABS.map((tab) => (
                        <li
                            key={tab}
                            className={`cursor-pointer p-4 rounded mb-2 ${currentTab === tab ? "bg-gray-600" : "bg-gray-700"}`}
                            onClick={() => setCurrentTab(tab)}
                        >
                            {tab}
                        </li>
                    ))}
                </ul>
                <AddExpense getExpenses={getExpenses} isEditing={isEditing} setIsEditing={setIsEditing} />
                <Link className="bg-slate-200 rounded-md shadow-lg text-center text-black font-bold py-1" to="/upload">Upload XLSX file</Link>
                <button className="bg-slate-500 rounded-md shadow-lg text-center text-white font-bold py-1"
                    onClick={() => exportFromJSON({ data: filteredExpenses, fileName: 'exp', exportType: exportFromJSON.types.xls })}>Export to XLS</button>
            </div>

            {currentTab !== 'Analysis' && <>
                <div className="w-2/4 flex flex-col gap-4 p-5 bg-gray-100 h-screen">
                    <span className="font-semibold text-2xl px-4 mb-6 underline underline-offset-4 text-slate-700">{currentTab}</span>
                    {filteredExpenses.length > 0 ? <div className="flex justify-between px-4">
                        <input
                            type="checkbox"
                            checked={selectedExpenses.size === filteredExpenses.length}
                            onChange={() => {
                                if (selectedExpenses.size !== filteredExpenses.length) {
                                    setSelectedExpenses(new Set(filteredExpenses.map(item => item._id)))
                                } else {
                                    setSelectedExpenses(new Set())
                                }
                            }}
                            className="scale-125"
                        />
                        <button className='px-8 bg-red-400 font-bold text-white rounded-lg shadow-lg disabled:bg-gray-400' disabled={!selectedExpenses.size} onClick={deleteAllSelected}>Delete Selected</button>
                    </div> :
                        <div className="px-4">
                            <span className="font-medium text-lg text-slate-500">Please add data to get started today!</span>
                        </div>}
                    <div className="flex flex-col gap-4 overflow-y-scroll">
                        {filteredExpenses.map(exp => <div key={exp._id} className='w-full flex justify-center items-center px-4 gap-4'>
                            <input
                                type="checkbox"
                                checked={selectedExpenses.has(exp._id)}
                                onChange={() => handleCheckboxChange(exp._id)}
                                className='basis-1/12'
                            />
                            <span className='basis-2/6 font-medium text-lg'>{exp.expenseType}
                                {exp?.remarks && <span className="text-slate-600 text-base"> : {exp?.remarks}</span>}
                            </span>
                            <span className='basis-1/6'>{new Date(exp.date).toISOString().split('T')[0]}</span>
                            <span className='basis-1/6 font-bold'>₹{exp.amount}</span>
                            <button className='basis-1/6 bg-blue-400 font-bold text-white rounded-lg shadow-lg' onClick={() => setIsEditing(exp)}>Edit</button>
                            <button className='basis-1/6 bg-red-400 font-bold text-white rounded-lg shadow-lg' onClick={() => deleteExpense(exp._id)}>Delete</button>
                        </div>)}
                    </div>
                </div>
                <div className="w-1/4">
                    <Expenses expenses={filteredExpenses} />
                </div>
            </>}

            {currentTab === 'Analysis' && <div className="w-3/4 flex flex-col gap-4 p-5 bg-gray-100 h-screen">
                <span className="font-semibold text-2xl px-4 mb-6 underline underline-offset-4 text-slate-700">{currentTab}</span>
                <Analysis expenses={expenses} />
            </div>}
        </div>
    );
};

export default App;
