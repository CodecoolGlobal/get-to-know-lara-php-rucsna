import {Navigate, Route, Routes} from "react-router-dom";
import GuestLayout from "./Pages/Layouts/GuestLayout.jsx";
import Registration from "./Pages/GuestPages/Registration.jsx";
import UserLayout from "./Pages/Layouts/UserLayout.jsx";
import Update from "./Pages/UserPages/Update.jsx";
import CurrentMail from "./Pages/UserPages/CurrentMail.jsx";
import NotFound from "./Pages/NotFound.jsx";
import Login from "./Pages/GuestPages/Login.jsx";
import Dashboard from "./Pages/UserPages/Dashboard.jsx";

const App = () => {
    return(
        <Routes>
            <Route path="/guest" element={<GuestLayout/>}>
                <Route index element={<Navigate to="/guest/login" />} />
                <Route path="/guest/login" element={<Login/>} />
                <Route path="/guest/registration" element={<Registration />} />
            </Route>
            <Route path="/" element={<UserLayout/>}>
                <Route index element={<Navigate to="/dashboard"/>} />
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/dashboard/draft/:id" element={<Update/>} />
                <Route path="/dashboard/mail/:id" element={<CurrentMail/>} />
            </Route>
            <Route path="*" element={<NotFound/>} />
        </Routes>
    );
};

export default App;