import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { routes } from './route/Routes';
import { Toaster } from 'react-hot-toast';

function App() {
  const route = createBrowserRouter(routes);

  return (
    <>
    <RouterProvider router={route} />
    <Toaster position="bottom-center" duration={500} />
    </>
  )
}

export default App