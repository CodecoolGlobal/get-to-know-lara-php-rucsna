import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./Pages/GuestPages/Login.jsx";
import Registration from "./Pages/GuestPages/Registration.jsx";
import NotFound from "./Pages/NotFound";
import UserLayout from "./Pages/Layouts/UserLayout.jsx";
import GuestLayout from "./Pages/Layouts/GuestLayout.jsx";
import Inbox from "./Pages/UserPages/Inbox.jsx";
import Compose from "./Pages/UserPages/Compose.jsx";
import Sent from "./Pages/UserPages/Sent.jsx";
import CurrentMail from "./Pages/UserPages/CurrentMail.jsx";
import About from "./Pages/GuestPages/About.jsx";
import Bin from "./Pages/UserPages/Bin.jsx";
import Drafts from "./Pages/UserPages/Drafts.jsx";
import Update from "./Pages/UserPages/Update.jsx";
import Dashboard from "./Components/Dashboard.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <UserLayout/>,
        children: [
            {
                path: '/',
                element: <Navigate to='/dashboard'/>
            },
            {
                path: '/dashboard',
                element: <Dashboard/>
            },
            {
                path: '/inbox',
                element: <Inbox/>
            },
            {
                path: '/compose',
                element: <Compose/>
            },
            {
                path: '/drafts',
                element: <Drafts/>
            },
            {
                path: '/draft/:id',
                element: <Update/>
            },
            {
                path: '/sent',
                element: <Sent/>
            },
            {
                path: '/bin',
                element: <Bin/>
            },
            {
                path: '/currentMail/:id',
                element: <CurrentMail/>
            }
        ]
    },
    {
        path: '/',
        element: <GuestLayout/>,
        children: [
            {
                path: '/',
                element: <Login/>
            },
            {
                path: '/about',
                element: <About/>
            },
            {
                path: '/login',
                element: <Login/>
            },
            {
                path: '/registration',
                element: <Registration/>
            }
        ]
    },
    {
        path: '*',
        element: <NotFound/>
    }
]);
export default router;