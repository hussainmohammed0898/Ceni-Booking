import HomeLayout from "../layout/HomeLayout";
import ForgotPassword from "../components/forgotPassword/ForgotPassword";
import Home from "../pages/Home";
import Movies from "../pages/Movies";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import ResetPassword from "../components/forgotPassword/ResetPassword";
import UserRoute from "../protectRoute/UserRoute";
import AuthRoute from "../protectRoute/AuthRoute";
import UserLayout from "../layout/UserLayout";
import MovieDetails from "../pages/MovieDetails";
import Show from "../pages/Show";

export const routes = [{
    element: <HomeLayout/>,
    children: [{
        path: "/",
        element:<AuthRoute><Home/></AuthRoute>
    },
    {
        path:'/movies',
        element:<Movies/>
    },
    {
        path:"/sign-up",
        element:<AuthRoute><Signup/></AuthRoute>
    },
    {
        path:"/login",
        element:<AuthRoute><Signin/></AuthRoute>
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
        element:  <UserLayout />,
        children: [
            {
                path:'/home',
                element:<UserRoute><Home/></UserRoute>
            },
            {
                path: "/userHome",
                element:<UserRoute><Movies/></UserRoute>
            },
            {
                path: "/movie/:id",
                element: <UserRoute><MovieDetails /></UserRoute>
            },
            {
                path: "/shows/:id",
                element: <UserRoute><Show/> </UserRoute>
               
              },
            
        ]
}]