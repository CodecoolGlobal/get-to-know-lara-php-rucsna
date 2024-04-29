import {Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider.jsx";

function GuestLayout() {
    const {token} = useStateContext();
    if(token){
        return <Navigate to={'/'} />
    }

    return (
        <div className="container">
            <nav className="navbar navbar-expand-sm bg-light justify-content-end">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="/GuestPages/Login">Login</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/GuestPages/Registration">Registration</a>
                    </li>
                </ul>
            </nav>
            <Outlet/>
        </div>
    )
}

export default GuestLayout;