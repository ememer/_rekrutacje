import React from 'react';

import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import DestinationMap from './components/DestinationMap';
import Layout from './components/Layout';
import ApiResponseContextProvider from './Context/ApiResponseContextProvider';
import AutoCompleteContextProvider from './Context/AutoCompleteProvider';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      {
        path: '/calculated-road',
        element: <DestinationMap />,
      },
    ],
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <ApiResponseContextProvider>
      <AutoCompleteContextProvider>
        <RouterProvider router={router} />
      </AutoCompleteContextProvider>
    </ApiResponseContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
