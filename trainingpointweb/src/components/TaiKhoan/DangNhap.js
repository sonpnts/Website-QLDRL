import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';
import { MyDispatchContext, MyUserContext } from "../../configs/MyContext";
import APIs, { endpoints, authAPI } from "../../configs/APIs";
import cookie from "react-cookies";

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
                //  'client_id': 'YN17cy35cApl9PUiBuPCO0eTKgEEFtVWTV7I67lV',
                // 'client_secret': '0LpVpqTQ6fcHCwCSfCqKx0JcEzFfGHnf857IuKgtsf2sl1KX3HdqlpTQBUSGiTUm3CaZeqtYZCMXn59Cqfc79pfKu1LVtNUNbIBbO0JnrfbqvAmB3N9xRCHLhDBJI1YM',
                'grant_type': "password"
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 200) {
                cookie.save("token", res.data.access_token);
                console.info(res.data);
                // console.log();
                let userdata = await authAPI(cookie.load("token")).get(endpoints['current_taikhoan']);
                cookie.save('user', userdata.data);
               

                dispatch({
                    "type": "login",
                    "payload": userdata.data
                });
                // let firebase = await APIs.get(endpoints['firebase'], {
                //     headers: {
                //         Authorization: `Bearer ${cookie.load('token')}`,
                //     },
                // });
                // cookie.save('firebase-token', firebase.data.token);
                // setLoading(false);
                // console.log(cookie.load('firebase-token'));
                console.log("Đăng nhập thành công!");
                nav("/"); // Điều hướng tới trang chính sau khi đăng nhập thành công
            } else {
                setError("Sai tên đăng nhập hoặc mật khẩu");
            }

        } catch (ex) {
            console.error("Lỗi tại màn hình đăng nhập:", ex);
            setError("Sai tên hoặc mật khẩu, vui lòng thử lại.");
            setLoading(false);
        }
    };

    const register = () => {
        nav("/dang-ky");
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md="6">
                    <Card className="p-4 shadow-sm">
                        <Card.Body>
                            <h2 className="mb-4 text-center">Đăng Nhập</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form>
                                <Form.Group controlId="formBasicUsername" className="mb-3">
                                    <Form.Label>Tên đăng nhập</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tên đăng nhập"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formPassword" className="mb-3">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>
                                
                                <Form.Group controlId="formShowPassword" className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Hiển thị mật khẩu"
                                        onChange={toggleShowPassword}
                                    />
                                </Form.Group>

                                {loading ? <div className="d-flex justify-content-center mb-3"><Spinner animation="border" /></div> : 
                                    <Button variant="primary" onClick={login} className="w-100 mb-3">
                                        Đăng nhập
                                    </Button>
                                }
                                
                                <Button variant="secondary" onClick={register} className="w-100">
                                    Đăng ký
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};


export default DangNhap;
