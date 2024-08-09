import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import { routes } from './route/Routes';
import { Toaster } from 'react-hot-toast';


const route = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={route} />
    <Toaster position="bottom-center" duration={500} />
  </React.StrictMode>,
)
