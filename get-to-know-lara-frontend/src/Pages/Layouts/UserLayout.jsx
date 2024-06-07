import {Outlet, useNavigate} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";
import {useEffect} from "react";
import {Button, Container, Image, Nav, Navbar, NavbarBrand} from "react-bootstrap";

function UserLayout() {
    const {token, user, setUser, storeToken} = useStateContext();
    const navigate = useNavigate();

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
            navigate('/guest');
        } else if (token && !user) {
            getUser();
        }
    }, [navigate, setUser, token, user]);

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
        <div>
            <Navbar expand="sm" className="bg-primary" data-bs-theme="dark">
                <Container className="container-fluid">
                    <NavbarBrand href="/">
                        <Image src="../../../assets/ZM_logo.png" style={{maxHeight: '60px'}}/>
                    </NavbarBrand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="/dashboard" className="active text-light">{user.name}</Nav.Link>
                            <Button onClick={handleLogout} className="active text-light">Logout</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet/>
        </div>
    )
}

export default UserLayout;
