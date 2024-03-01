import { Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

function Layout() {
  const { setUser, storeToken, user } = useStateContext();
  const token = localStorage.getItem('ACCESS_TOKEN');

  const handleLogout = async () => {
    try {
      await axiosClient.post('/logout');
      setUser(null);
      storeToken(null);

    } catch (error) {
      
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-sm bg-light justify-content-end">
        <ul className="navbar-nav">
          {token && user ?
            (<>
              <li className="nav-item">
                <a className="nav-link" href="/">{user.name}</a>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>Logout</button>
              </li>
            </>) :
            (<li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>)
          }
          {!token &&
            <>
              <li className="nav-item">
                <a className="nav-link" href="/login">Login</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/registration">Registration</a>
              </li>
            </>
          }
        </ul>
      </nav>
      <Outlet />
    </>
  )
}

export default Layout;
