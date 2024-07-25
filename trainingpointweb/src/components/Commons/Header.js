// import { useContext, useState } from "react";
// import { Badge, Button, Col, Container, Form, Image, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import { MyDispatchContext, MyUserContext } from "../../configs/MyContext";
// import APIs, { endpoints } from "../../configs/APIs";
// import MySpinner from "./MySpinner";
// import './Styles.css';

// const Header = () => {
//     const user = useContext(MyUserContext);
//     const dispatch = useContext(MyDispatchContext);
//     const [hovered, setHovered] = useState(null);
    
//     const nav = useNavigate();
//     const handleLogout = () => {
//         dispatch({ type: "logout" });
//         // window.location.reload(); // Navigate to the home page or any other desired route after logout
//     };
//     return (
//         <Navbar expand="lg" className="bg-body-tertiary1">
//             <Container>
//                 <Navbar.Brand href="/" style={{ fontWeight: 'bold' }}>QUẢN LÝ ĐIỂM RÈN LUYỆN</Navbar.Brand>
//                 <Navbar.Toggle aria-controls="basic-navbar-nav" />
//                 <Navbar.Collapse id="basic-navbar-nav">
//                     <Nav className="ms-auto">
//                         <Nav.Link 
//                         className="nav-link"              
//                                   href="/" 
                       
//                         >
//                         <i className="fa-solid fa-house"></i> Trang chủ
//                         </Nav.Link>
//                         {user === null ? (
//                         <>
//                             <Link 
//                             to="/dang-ky" 
//                             className="nav-link"
                           
//                             >
//                             <i className="fa-solid fa-user-plus"></i> Đăng ký
//                             </Link>
//                             <Link 
//                             to="/dang-nhap" 
//                             className="nav-link"
                           
//                             >
//                             <i className="fa-solid fa-right-to-bracket"></i> Đăng nhập
//                             </Link>
//                         </>
//                         ) : (
//                         <>
//                             {(user.role === 4) && (
//                                 <>
//                                 <Link 
//                                     to="/chat" 
//                                     className={'nav-link'}                                    
//                                 >
//                                     <i className="fa-solid fa-comments"></i> Chat
//                                 </Link>
//                                 <Link to="/hdnk-diem-danh" 
//                                     className={'nav-link'}                                    
//                                 >
//                                     <i class="fa-regular fa-star"></i> Xem thành tích các nhân
//                                 </Link>
//                                 <Link to="/hdnk-chua-diem-danh" 
//                                     className={'nav-link'}                                    
//                                 >
//                                     <i class="fa-brands fa-slack"></i> Báo thiếu
//                                 </Link>

//                                 </>
//                                 )}

//                             {(user.role === 2 || user.role === 3) && (
//                             <>
                              
//                                 <NavDropdown title={<span><i class="fa-solid fa-sliders"></i> Hoạt động</span>} id="basic-nav-dropdown">
//                                 <NavDropdown.Item href="/quan-ly-hoat-dong" className="nav-link">
//                                     <i className="fa-solid fa-tasks"></i> Quản lý các hoạt động
//                                 </NavDropdown.Item>
//                                 <NavDropdown.Item href="/tao-hoat-dong" className="nav-link">
//                                     <i className="fa-solid fa-plus"></i> Tạo hoạt động
//                                 </NavDropdown.Item>
//                                 <NavDropdown.Item href="/hoat-dong-chua-co-bai-viet" className="nav-link">
//                                 <i class="fa-solid fa-pen"></i> Tạo bài viết
//                                 </NavDropdown.Item>

                               

//                                 <NavDropdown.Item href="#action/3.3" className="nav-link">
//                                     <i className="fa-solid fa-trash"></i> Xem lại hoạt động đã xóa
//                                 </NavDropdown.Item>
//                                 </NavDropdown>
//                                 <NavDropdown title={<span><i class="fa-solid fa-gears"></i>Thao tác</span>} id="basic-nav-dropdown">
//                                 <NavDropdown.Item href="/diem-danh">
//                                     <i className="fa-solid fa-check"></i> Điểm danh sinh viên
//                                 </NavDropdown.Item>
//                                 <NavDropdown.Item href="/danh-sach-bao-thieu">
//                                     <i className="fa-solid fa-exclamation"></i> Báo thiếu
//                                 </NavDropdown.Item>
//                                 <NavDropdown.Item href="/export-bao-cao" title="Xuất báo cáo" >
//                                     <i className="fa-solid fa-file-export"></i> Xuất báo cáo
//                                 </NavDropdown.Item>
//                                 <NavDropdown.Item href="/danh-sach-sinh-vien">
//                                     <i className="fa-solid fa-star"></i> Xem thành tích sinh viên
//                                 </NavDropdown.Item>
//                                 {user.role === 2 && (
//                                     <NavDropdown.Item href="/them-tro-ly-khoa">
//                                     <i className="fa-solid fa-user-plus"></i> Thêm trợ lý sinh viên khoa
//                                     </NavDropdown.Item>
//                                 )}
//                                 <NavDropdown.Item href="/chat-list">
//                                     <i className="fa-solid fa-comments"></i> Tin nhắn hỗ trợ
//                                 </NavDropdown.Item>
//                                 </NavDropdown>
//                             </>
//                             )}
//                             <Link 
//                             to="/profile" 
//                             className={`nav-link text-success ${hovered === 'profile' ? 'animate__animated animate__bounce' : ''}`}
//                             onMouseEnter={() => setHovered('profile')}
//                             onMouseLeave={() => setHovered(null)}
//                             >
//                             <Image src={user.avatar} width="30" height="30" roundedCircle /> 
//                             </Link>
//                             <Nav.Link href="/profile" style={{marginLeft:0}} className="nav-link text-info">
//                             {user.username}
//                             </Nav.Link>
//                             <Link 
//                             to="/dang-nhap" 
//                             onClick={handleLogout} 
//                             className= "nav-link"
                            
//                             >
//                             <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
//                             </Link>
//                         </>
//                         )}
//                     </Nav>
//                     </Navbar.Collapse> 

//             </Container>
//         </Navbar>
//     );
// }
// export default Header;import { useContext, useState } from "react";



import React, { useContext, useState } from "react";
import { Badge, Button, Col, Container, Form, Image, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyDispatchContext, MyUserContext } from "../../configs/MyContext";
import APIs, { endpoints } from "../../configs/APIs";
import MySpinner from "./MySpinner";
import './Styles.css';

const Header = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const [hovered, setHovered] = useState(null);

    const nav = useNavigate();
    const handleLogout = () => {
        dispatch({ type: "logout" });
        nav('/'); // Navigate to the home page or any other desired route after logout
    };

    return (
            <Navbar expand="lg" className="bg-body-tertiary1 navbar-sticky">
                <Container >
                    <Navbar.Brand href="/" style={{ fontWeight: 'bold' }}>QUẢN LÝ ĐIỂM RÈN LUYỆN</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link 
                                className="nav-link"              
                                href="/" 
                            >
                                <i className="fa-solid fa-house"></i> Trang chủ
                            </Nav.Link>
                            {user === null ? (
                                <>
                                    <Link 
                                        to="/dang-ky" 
                                        className="nav-link"
                                    >
                                        <i className="fa-solid fa-user-plus"></i> Đăng ký
                                    </Link>
                                    <Link 
                                        to="/dang-nhap" 
                                        className="nav-link"
                                    >
                                        <i className="fa-solid fa-right-to-bracket"></i> Đăng nhập
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {user.role === 4 && (
                                        <>
                                            <Link 
                                                to="/chat" 
                                                className="nav-link"
                                            >
                                                <i className="fa-solid fa-comments"></i> Chat
                                            </Link>
                                            <Link 
                                                to="/hdnk-diem-danh" 
                                                className="nav-link"
                                            >
                                                <i className="fa-regular fa-star"></i> Xem thành tích các nhân
                                            </Link>
                                            <Link 
                                                to="/hdnk-chua-diem-danh" 
                                                className="nav-link"
                                            >
                                                <i className="fa-brands fa-slack"></i> Báo thiếu
                                            </Link>
                                        </>
                                    )}
                                    {(user.role === 2 || user.role === 3) && (
                                        <>
                                            <NavDropdown title={<span><i className="fa-solid fa-sliders"></i> Hoạt động</span>} id="basic-nav-dropdown">
                                                <NavDropdown.Item href="/quan-ly-hoat-dong" className="nav-link">
                                                    <i className="fa-solid fa-tasks"></i> Quản lý các hoạt động
                                                </NavDropdown.Item>
                                                <NavDropdown.Item href="/tao-hoat-dong" className="nav-link">
                                                    <i className="fa-solid fa-plus"></i> Tạo hoạt động
                                                </NavDropdown.Item>
                                                <NavDropdown.Item href="/hoat-dong-chua-co-bai-viet" className="nav-link">
                                                    <i className="fa-solid fa-pen"></i> Tạo bài viết
                                                </NavDropdown.Item>
                                                <NavDropdown.Item href="#action/3.3" className="nav-link">
                                                    <i className="fa-solid fa-trash"></i> Xem lại hoạt động đã xóa
                                                </NavDropdown.Item>
                                            </NavDropdown>
                                            <NavDropdown title={<span><i className="fa-solid fa-gears"></i> Thao tác</span>} id="basic-nav-dropdown">
                                                <NavDropdown.Item href="/diem-danh">
                                                    <i className="fa-solid fa-check"></i> Điểm danh sinh viên
                                                </NavDropdown.Item>
                                                <NavDropdown.Item href="/danh-sach-bao-thieu">
                                                    <i className="fa-solid fa-exclamation"></i> Báo thiếu
                                                </NavDropdown.Item>
                                                <NavDropdown.Item href="/export-bao-cao" title="Xuất báo cáo">
                                                    <i className="fa-solid fa-file-export"></i> Xuất báo cáo
                                                </NavDropdown.Item>
                                                <NavDropdown.Item href="/danh-sach-sinh-vien">
                                                    <i className="fa-solid fa-star"></i> Xem thành tích sinh viên
                                                </NavDropdown.Item>
                                                {user.role === 2 && (
                                                    <NavDropdown.Item href="/them-tro-ly-khoa">
                                                        <i className="fa-solid fa-user-plus"></i> Thêm trợ lý sinh viên khoa
                                                    </NavDropdown.Item>
                                                )}
                                                <NavDropdown.Item href="/chat-list">
                                                    <i className="fa-solid fa-comments"></i> Tin nhắn hỗ trợ
                                                </NavDropdown.Item>
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
                                    <Nav.Link href="/profile" style={{marginLeft:0}} className="nav-link text-info">
                                        {user.username}
                                    </Nav.Link>
                                    <Link 
                                        to="/dang-nhap" 
                                        onClick={handleLogout} 
                                        className="nav-link"
                                    >
                                        <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
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
