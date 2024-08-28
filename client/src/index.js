import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ExcelReader from './Components/ReadExcel';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: 'upload',
        element: <ExcelReader />
    }
])
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
