import { useContext, useState } from "react";
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
                        <Nav.Link className={`nav-link ${hovered === 'home' ? 'animate__animated animate__bounce' : ''}`} href="/" 
                        onMouseEnter={() => setHovered('home')}
                        onMouseLeave={() => setHovered(null)}
                        >
                            <i className="fa-solid fa-house"></i> Trang chủ
                        </Nav.Link>
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
                           {(user.role === 2 || user.role === 3) && (
                                <>
                                 
                                 <>
                                    {(user.role === 4 ) && (
                                        <>
                                            <Link 
                                                to="/chat" 
                                                className={`nav-link text-info ${hovered === 'chat' ? 'animate__animated animate__bounce' : ''}`}
                                                onMouseEnter={() => setHovered('chat')}
                                                onMouseLeave={() => setHovered(null)}
                                            >
                                                <i className="fa-solid fa-comments"></i> Chat
                                            </Link>
                                        </>
                                    )}
                                </>
                                <NavDropdown title="Hoạt động" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/quan-ly-hoat-dong" className="nav-link ">Quản lý các hoạt động</NavDropdown.Item>
                                    <NavDropdown.Item href="/tao-hoat-dong" className="nav-link ">
                                        Tạo hoạt động
                                    </NavDropdown.Item >
                                    <NavDropdown.Item href="#action/3.3" className="nav-link ">Xem lại hoạt động đã xóa</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Thao tác" id="basic-nav-dropdown" >
                                    <NavDropdown.Item href="/diem-danh">Điểm danh sinh viên</NavDropdown.Item>
                                    <NavDropdown.Item href="">
                                        Báo thiếu
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/export-bao-cao" title="Xuất báo cáo" class="nav-link text-info ">

                                    <i class="fa-solid fa-file-export"></i> Xuất báo cáo
                                    </NavDropdown.Item>
                                
                                    <NavDropdown.Item href="">
                                        Xem thành tích sinh viên
                                    </NavDropdown.Item>
                                    <>
                                        {user.role === 2 && (
                                        <>
                                            <NavDropdown.Item href="">Thêm trợ lý sinh viên khoa</NavDropdown.Item>
                                        </>
                                        )}
                                    </>
                                    <NavDropdown.Item href="">Tin nhắn hỗ trợ</NavDropdown.Item>
                                </NavDropdown>
                                </>
                            )}
                                <Link 
                                    to="/profile" 
                                    className={`nav-link text-success ${hovered === 'profile' ? 'animate__animated animate__bounce' : ''}`}
                                    onMouseEnter={() => setHovered('profile')}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <Image src={user.avatar} width="30" height="30" roundedCircle /> 
                                    
                                </Link>
                                <Nav.Link href="/profile" style={{marginLeft:0}} className="nav-link text-infot">{user.username}</Nav.Link>

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