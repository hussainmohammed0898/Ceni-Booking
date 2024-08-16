import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes/Route";
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
