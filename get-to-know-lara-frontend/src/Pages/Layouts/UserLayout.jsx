import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";
import {useEffect, useState} from "react";

function UserLayout() {
    const [isInbox, setIsInbox] = useState(true);
    const [isCompose, setIsCompose] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [isBin, setIsBin] = useState(false);

    const {token, user, setUser, storeToken} = useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = () => {
            axiosClient.get('/user')
                .then(response => {
                    setUser(response.data);
                    console.log(response.data);
                })
                .catch(err => {
                    console.error("Error with getting user data", err);
                })
        };
        if(token){
            getUser();
        }
    }, [setUser, token]);

    const handleLogout = () => {
        axiosClient.post('/logout')
            .then(() => {
                setUser({});
                storeToken(null);
                console.log("successful logout");
            })
            .catch(error => {
                console.error("error with logout", error);
            })
    };

    const handleNavigation = (path) => {
        setIsInbox(path === '/inbox');
        setIsCompose(path === '/compose');
        setIsSent(path === '/sent');
        setIsBin(path === '/bin');
        navigate(path);
    }

    if (!token) {
        return <Navigate to={'/login'}/>
    }

    return (
        <div className="container">
            <nav className="navbar navbar-expand-sm bg-light justify-content-end">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="/get-to-know-lara-frontend/public">{user.name}</a>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
                <div className="row">
                    <div className="col-md-3">
                        <div className="btn-group-vertical" role="group" aria-label="Basic example">
                            <button type="button" className={`btn ${isCompose ? 'btn-secondary' : 'btn'}`}
                                    onClick={() => handleNavigation('/compose')}>Compose
                            </button>
                            <button type="button" className={`btn ${isInbox ? 'btn-secondary' : 'btn'}`}
                                    onClick={() => handleNavigation('/inbox')}>Inbox
                            </button>
                            <button type="button" className={`btn ${isSent ? 'btn-secondary' : 'btn'}`}
                                    onClick={() => handleNavigation('/sent')}>Sent
                            </button>
                            <button type="button" className={`btn ${isBin ? 'btn-secondary' : 'btn'}`}
                                    onClick={() => handleNavigation('/bin')}>Bin
                            </button>
                        </div>
                    </div>
                <div className="col-md-6 offset md-3">
                    <Outlet/>
                </div>
                </div>
        </div>
    )
}

export default UserLayout;
