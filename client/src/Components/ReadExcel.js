import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { EXPENSE_TYPES } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExcelReader = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate()

    const handleFileUpload = (event) => {
        if (event.target.files.length === 0) return
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            setData(worksheet.map(item => {
                if (!isNaN(Number(item[1]))) {
                    return [item[2], item[5], item[6], '']
                } return []
            }));
        };

        reader.readAsBinaryString(file);
    };

    const handleEdit = (rowIndex, colIndex, value) => {
        const newData = [...data];
        newData[rowIndex][colIndex] = value;
        setData(newData);
    };

    const handleMassAdd = async () => {
        const newData = data.filter(item => item.length === 4);
        if (newData.length === 0) return;
        const arr = newData.filter(item => EXPENSE_TYPES.includes(item[1])).map(item => {
            return {
                expenseType: item[1],
                date: `${item[0].split('/')[2]}-${item[0].split('/')[1]}-${item[0].split('/')[0]}`,
                amount: item[2],
                remarks: item[3]
            }
        })
        try {
            await axios.post('http://localhost:8080/expenses/bulk', arr)
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <div className='flex gap-6'>
                <Link className='bg-slate-700 w-fit py-1 px-8 rounded-md shadow-lg text-white font-bold' to="/">Go To Main Dashboard</Link>
                <button className='py-1 px-8 bg-green-600 rounded-md shadow-lg text-white font-bold' onClick={handleMassAdd}>Add</button>
            </div>
            <input type="file" onChange={handleFileUpload} className="mb-4 w-fit" />

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b w-[100px] bg-blue-300">Date</th>
                        <th className="py-2 px-4 border-b w-2/4 bg-green-300">Expense Type</th>
                        <th className="py-2 px-4 border-b w-1/4 bg-yellow-300">Amount</th>
                        <th className="py-2 px-4 border-b w-1/4 bg-red-300">Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => {
                                if (colIndex === 1) {
                                    return <td key={colIndex} className="py-2 px-4 border-b">
                                        <select
                                            type="text"
                                            value={cell || ''}
                                            onChange={(e) => handleEdit(rowIndex, colIndex, e.target.value)}
                                            className="w-full"
                                        >
                                            <option value="cell">{cell}</option>
                                            {EXPENSE_TYPES.map(exp => <option value={exp} key={exp}>{exp}</option>)}
                                        </select>
                                    </td>
                                } else if (colIndex === 2 || colIndex === 3) {
                                    return <input
                                        type="text"
                                        value={cell || ''}
                                        onChange={(e) => handleEdit(rowIndex, colIndex, e.target.value)}
                                        className="w-1/2"
                                    />
                                } else return <td key={colIndex} className="py-2 px-4 border-b w-1/6">
                                    <span>{cell}</span>
                                </td>

                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExcelReader;
