import AdminDashboard from "../component/admin/AdminDashboard";
import MoviesList from "../component/admin/MoviesList";
import Login from "../component/auth/Login";
import Signup from "../component/auth/Signup";
import ForgotPassword from "../component/forgotpassword/ForgotPassword";
import ResetPassword from "../component/forgotpassword/ResetPassword";
import AdminLayout from "../layout/AdminLayout";
import HomeLayout from "../layout/HomeLayout";
import Home from "../pages/Home";
import AdminRoutes from "../privateRoute/AdminRoutes";

export const routes = [
    {
        element: <HomeLayout/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path:'/sign-up',
                element: <Signup/>
            },
            {
                path:'/login',
                element: <Login/>
            },
            {
                path: "/forgot-password",
                element:<ForgotPassword/>
            },
            {
                path: "/reset-password/:id/:token",
                element:<ResetPassword/>
            },
        ]
    },
    {
        element:<AdminLayout/>,
        children:[
            {
                path:'/adminDashboard',
                element:<AdminRoutes><AdminDashboard/></AdminRoutes>

            },
            {
                path:'/movies',
                element:<AdminRoutes><MoviesList/></AdminRoutes>
            }
        ]
    }
]