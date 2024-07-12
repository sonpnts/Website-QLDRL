import { useContext, useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, Image, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyDispatchContext, MyUserContext } from "../../configs/MyContext";
import APIs, { endpoints } from "../../configs/APIs";
import MySpinner from "./MySpinner";
import 'animate.css';

const Header = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const [hovered, setHovered] = useState(null);

    const nav = useNavigate();
    const handleLogout = () => {
        dispatch({ type: "logout" });
        window.location.reload(); // Navigate to the home page or any other desired route after logout
    };
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">Quản lý điểm rèn luyện</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Link className={`nav-link ${hovered === 'home' ? 'animate__animated animate__bounce' : ''}`} to="/" 
                        onMouseEnter={() => setHovered('home')}
                        onMouseLeave={() => setHovered(null)}
                        >
                            <i className="fa-solid fa-house"></i> Trang chủ
                        </Link>
                        {user === null ? (
                            <>
                                <Link 
                                    to="/dang-ky" 
                                    className={`nav-link text-success ${hovered === 'register' ? 'animate__animated animate__bounce' : ''}`}
                                    onMouseEnter={() => setHovered('register')}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <i className="fa-solid fa-user-plus"></i> Register
                                </Link>
                                <Link 
                                    to="/dang-nhap" 
                                    className={`nav-link text-info ${hovered === 'login' ? 'animate__animated animate__bounce' : ''}`}
                                    onMouseEnter={() => setHovered('login')}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <i className="fa-solid fa-right-to-bracket"></i> Login
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/chat" 
                                    className={`nav-link text-info ${hovered === 'chat' ? 'animate__animated animate__bounce' : ''}`}
                                    onMouseEnter={() => setHovered('chat')}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <i className="fa-solid fa-comments"></i> Chat
                                </Link>
                                <Link 
                                    to="/profile" 
                                    className={`nav-link text-success ${hovered === 'profile' ? 'animate__animated animate__bounce' : ''}`}
                                    onMouseEnter={() => setHovered('profile')}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <Image src={user.avatar} width="40" height="40" roundedCircle /> {user.username}
                                </Link>
                                <Link 
                                    to="#" 
                                    onClick={handleLogout} 
                                    className={`nav-link ${hovered === 'logout' ? 'animate__animated animate__bounce' : ''}`}
                                    onMouseEnter={() => setHovered('logout')}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                                </Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default Header;