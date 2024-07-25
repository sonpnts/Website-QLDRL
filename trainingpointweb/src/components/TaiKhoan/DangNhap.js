import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
import { MyDispatchContext, MyUserContext } from "../../configs/MyContext";
import APIs, { endpoints, authAPI } from "../../configs/APIs";
import cookie from "react-cookies";
import './DangNhap.css';

const DangNhap = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const nav = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useContext(MyDispatchContext);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    
    const login = async () => {
        setLoading(true);
        try {
            let res = await APIs.post(endpoints['dang_nhap'], {
                'username': username,
                'password': password,
                'client_id': "sdUIX9LsM0sEZH8ipS6op9WPiNjEK8mGU2wV1v8u",
                'client_secret': "rUygoi2fiap7rBvHjOULOulzYWDItVEQ8xC2QkPgn8iD0xIuSNB6gFvUhtHMtJFxg8GGveIkIYK7JDClKknom3ETDZop5Le8BRezqehWcRywwGHTxb6xjtio5xwRLAq7",
                'grant_type': "password"
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 200) {
                cookie.save("token", res.data.access_token);
                let userdata = await authAPI(cookie.load("token")).get(endpoints['current_taikhoan']);
                cookie.save('user', userdata.data);
               
                dispatch({
                    "type": "login",
                    "payload": userdata.data
                });
                
                console.log("Đăng nhập thành công!");
                nav("/"); 
            } else {
                setError("Sai tên đăng nhập hoặc mật khẩu");
            }

        } catch (ex) {
            console.error("Lỗi tại màn hình đăng nhập:", ex);
            setError("Sai tên hoặc mật khẩu, vui lòng thử lại.");
            setLoading(false);
        }
    };
    
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            login();
        }
    };

    const register = () => {
        nav("/dang-ky");
    };

    return (
        <div className="registration-background1">
        <div className="form-container">
            <section>
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-9 col-lg-6 col-xl-5">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                                className="img-fluid" alt="Sample image" />
                        </div>
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            <Form onKeyDown={handleKeyDown}>
                                <h2 className="mb-4 text-center">Đăng Nhập</h2>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form.Group controlId="formBasicUsername" className="form-outline mb-4">
                                    <Form.Label>Tên đăng nhập</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tên đăng nhập"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="form-control form-control-lg"
                                    />
                                </Form.Group>
    
                                <Form.Group controlId="formPassword" className="form-outline mb-3">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-control form-control-lg"
                                    />
                                </Form.Group>
                                
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="form-check mb-0">
                                        <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                                        <label className="form-check-label" htmlFor="form2Example3">
                                            Hiển thị mật khẩu
                                        </label>
                                    </div>
                                </div>
    
                                <div className="text-center text-lg-start mt-4 pt-2">
                                    {loading ? 
                                        <div className="d-flex justify-content-center mb-3">
                                            <Spinner animation="border" />
                                        </div> : 
                                        <Button 
                                            variant="primary" 
                                            onClick={login} 
                                            className="btn btn-primary btn-lg"
                                            style={{paddingLeft: '2.5rem', paddingRight: '2.5rem'}}
                                        >
                                            Đăng nhập
                                        </Button>
                                    }
                                    <p className="small fw-bold mt-2 pt-1 mb-0">
                                        Không có tài khoản? <a href="#!" className="link-danger" onClick={register}>Đăng ký</a>
                                    </p>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
    
    );
};

export default DangNhap;
