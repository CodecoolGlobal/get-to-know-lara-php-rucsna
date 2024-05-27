import {Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider.jsx";

function GuestLayout() {
    const {token} = useStateContext();
    if(token){
        return <Navigate to={'/'} />
    }

    return (
        <div className="container">
            <nav className="navbar navbar-expand-sm bg-dark-subtle">
                <div className="container-fluid">
                    <a className="navbar-brand text-uppercase" href={"/"}>ZM</a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href={"/login"}>Login</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" href={"/registration"}>Sign up</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Outlet/>
        </div>
    )
}

export default GuestLayout;