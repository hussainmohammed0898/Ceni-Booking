import AdminDashboard from "../component/admin/AdminDashboard";
import ApproveTheater from "../component/admin/ApproveTheater";
import UserList from "../component/admin/UserLists";
import MoviesList from "../component/admin/MoviesList";
import PendingTheater from "../component/admin/PendingTheater";
import Login from "../component/auth/Login";
import Signup from "../component/auth/Signup";
import ForgotPassword from "../component/forgotpassword/ForgotPassword";
import ResetPassword from "../component/forgotpassword/ResetPassword";
import AddTheater from "../component/owner/AddTheater";
import MytheaterList from "../component/owner/MytheaterList";
import OwnerDashboard from "../component/owner/OwnerDashboard";
import OwnerMovieList from "../component/owner/OwnerMovieList";
import ShowList from "../component/owner/Showlist";
import AdminLayout from "../layout/AdminLayout";
import HomeLayout from "../layout/HomeLayout";
import OwnerLayout from "../layout/OwnerLayout";
import Home from "../pages/Home";
import AdminRoutes from "../privateRoute/AdminRoutes";
import OwnerRoutes from "../privateRoute/OwnerRoute";
import MovieDetails from "../component/admin/MovieDetails";




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
            },
            {
                path:'/theater/pending-approval',
                element:<AdminRoutes><PendingTheater/></AdminRoutes>
            },
            {
                path:"/theaters/approved",
                element:<AdminRoutes><ApproveTheater/></AdminRoutes>
            },
            {
                path:"/users",
                element:<AdminRoutes><UserList/></AdminRoutes>
            },
            {
                path:'movie-details/:id',
                elements:<AdminRoutes><MovieDetails/></AdminRoutes>
            }
        ]
    },
    {
        element: <OwnerLayout/>,
        children:[
            {
                path:"/ownerDashboard",
                element:<OwnerRoutes><OwnerDashboard/></OwnerRoutes>
            },
            {
                path:"/all-movies",
                element:<OwnerRoutes><OwnerMovieList/></OwnerRoutes>
            },
            {
                path:"/theater/add",
                element: <OwnerRoutes><AddTheater/></OwnerRoutes>
            },
            {
                path:"/theaters/my-theaters",
                element:<OwnerRoutes><MytheaterList/></OwnerRoutes>
            },
            {
                path: '/shows',
                element:<OwnerRoutes><ShowList/></OwnerRoutes>
            },
           
            
            
        ]
    }
]