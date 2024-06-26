import {Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider.jsx";

import {Container, Nav, Navbar, Image, NavbarBrand} from "react-bootstrap";

function GuestLayout() {
    const {token} = useStateContext();
    if (token) {
        return <Navigate to={'/'}/>
    }

    return (
        <div>
            <Navbar expand="sm" className="bg-primary" data-bs-theme="dark">
                <Container className="container-fluid">
                    <NavbarBrand href="/guest">
                        <Image src="../../../assets/ZM_logo.png" style={{maxHeight: '60px'}}/>
                    </NavbarBrand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="/guest/login">Login</Nav.Link>
                            <Nav.Link href="/guest/registration">Sign up</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet/>
        </div>
    );
}

export default GuestLayout;