import { Route, Routes } from "react-router-dom";
import { useStateContext } from "./contexts/ContextProvider";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import NotFound from "./Pages/NotFound";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";

const Router = () => {
    const {token} = useStateContext();

    return(
            <Routes>
                <Route path="/" element={token ? <Profile/> : <Home/>} />
                <Route path="/registration" element={<Registration/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="*" element={<NotFound/>} />
            </Routes>
    );
};

export default Router;