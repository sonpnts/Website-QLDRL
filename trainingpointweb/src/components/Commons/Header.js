import { useContext, useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, Image, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyDispatchContext, MyUserContext } from "../../configs/MyContext";
import APIs, { endpoints } from "../../configs/APIs";
import MySpinner from "./MySpinner";

const Header = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const nav = useNavigate();
    const handleLogout = () => {
        dispatch({ type: "logout" });
        window.location.reload(); // Navigate to the home page or any other desired route after logout
    };
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand href="#home">Student Activity Score Management</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Link className="nav-link" to="/">Trang chủ</Link>

                                {user === null ? <>
                                    <Link to="/dang-ky" className="nav-link text-success">Register</Link>
                                    <Link to="/dang-nhap" className="nav-link text-info">Login</Link>
                                </> : <>
                                    <Link to="/profile" className="nav-link text-success">
                                        <Image src={user.avatar} width="50" height="50" roundedCircle /> {user.username}
                                    </Link>
                                    <Link to="#" onClick={handleLogout} className="nav-link">Logout</Link>
                                </>}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
        </Navbar>
    );
}
export default Header;