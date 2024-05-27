import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";
import {useEffect} from "react";

function UserLayout() {
    const {token, user, setUser, storeToken} = useStateContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const getUser = () => {
            axiosClient.get('/user')
                .then(response => {
                    setUser(response.data);
                    //console.log(response.data);
                })
                .catch(err => {
                    console.error("Error with getting user data", err);
                })
        };
        if (!token) {
            navigate('/login');
        } else if (token && !user) {
            getUser();
            console.log(location.pathname);
        }
    }, [location.pathname, navigate, setUser, token, user]);

    if (!user) {
        return <div>Loading...</div>
    }

    const handleLogout = () => {
        axiosClient.post('/authentication/logout')
            .then(() => {
                setUser({});
                storeToken(null);
                console.log("successful logout");
            })
            .catch(error => {
                console.error("error with logout", error);
            })
    };

    return (
        <div className="container">
            <nav className="navbar navbar-expand-sm bg-dark-subtle">
                <div className="container-fluid">
                    <Link className="navbar-brand" to={"/"}>ZM</Link>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active text-success-emphasis" to={"/dashboard"}>{user.name}</Link>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link active text-success-emphasis" onClick={handleLogout}>Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
            <Outlet/>
        </div>
    )
}

export default UserLayout;
