import React, { useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Alert, Spinner, Modal, Card } from "react-bootstrap";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigate } from "react-router-dom";
import sendEmail from "./send_mail";

import './DangKy.css';

const DangKy = () => {
    const [user, setUser] = useState({
        email: "",
        username: "",
        password: "",
        avatar: "",
        role: "4"
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '']);
    const refs = useRef([]);
    const [randomOTP, setRandomOTP] = useState('');
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const [errors, setErrors] = useState({
        email: "",
        username: "",
        password: "",
        avatar: ""
    });

    const generateOTP = () => {
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const otpNum = randomNumber.toString().padStart(4, '0');
        setRandomOTP(otpNum);
        return otpNum;
    };

    const handleChangeText = (num, index) => {
        if (/^\d*$/.test(num) && num.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = num;
            setOtp(newOtp);

            if (num.length === 1 && index < otp.length - 1 && refs.current[index + 1]) {
                refs.current[index + 1].focus();
            }
        }
    };

    const change = (field, value) => {
        setUser(current => ({ ...current, [field]: value }));
        setErrors(current => ({ ...current, [field]: "" }));
    };

    const handleEmailChange = (e) => {
        change("email", e.target.value);
    };

    const handlePasswordChange = (e) => {
        change('password', e.target.value);
    };

    const handleUsernameChange = (e) => {
        change('username', e.target.value);
    };

    const handleChooseAvatar = async (e) => {
        const file = e.target.files[0];
        if (file) {
            change('avatar', file);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setErrors(current => ({ ...current, confirmPassword: "" }));
    };

    const validateEmail = (email) => {
        const re = /^\d{10}[a-zA-Z]+@ou\.edu\.vn$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const validateDangKy = async () => {
        let valid = true;
        let newErrors = { email: "", username: "", password: "", confirmPassword: "", avatar: "" };

        if (!validateEmail(user.email)) {
            newErrors.email = 'Email nhập không hợp lệ! Vui lòng nhập dạng 10 số + tên @ou.edu.vn';
            valid = false;
        }
        if (!validatePassword(user.password)) {
            newErrors.password = 'Password phải có từ 8 ký tự trở lên';
            valid = false;
        }
        if (user.password !== confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp!';
            valid = false;
        }
        if (!user.avatar) {
            newErrors.avatar = 'Avatar không tồn tại!';
            valid = false;
        }
        if (!user.username) {
            newErrors.username = 'Username không được để trống!';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            let tk_valid = false;
            try {
                const check = await APIs.get(`${endpoints['tai_khoan_is_valid']}?email=${user.email}&username=${user.username}`);
                if (check.status === 200) {
                    const res = check.data.is_valid;
                    if (res === true) {
                        tk_valid = true;
                    }
                }
            } catch (ex) {
                setLoading(false);
                console.error('Có lỗi gì đó đã xảy ra', 'Tài khoản sinh viên đã tồn tại!');
            }

            if (!tk_valid) {
                setLoading(true);
                try {
                    const otp = generateOTP();
                    const body = "Mã OTP của bạn là:" + otp;
                    const header = "Xác thực mã OTP tạo tài khoản sinh viên";
                    const res = await sendEmail(user.email, header, body);
                    if (res.status === 200) {
                        console.log('Gửi email thành công!', otp);
                        setLoading(false);
                        handleShow();
                    }
                } catch (error) {
                    console.error('Có lỗi xảy ra trong quá trình đăng ký:', error.message);
                    alert('Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại sau.');
                }
            }
        }
    };

    const handleSubmit = () => {
        const otpString = otp.join('');
        if (otpString === randomOTP) {
            handleClose();
            PostTaiKhoan();
        } else {
            alert('Mã OTP không chính xác. Vui lòng kiểm tra lại.');
        }
    };

    const PostTaiKhoan = async (e) => {
        try {
            setLoading(true);
            let form = new FormData();
            for (let key in user) {
                if (key === "avatar") {
                    form.append(key, user.avatar);
                } else {
                    form.append(key, user[key]);
                }
            }
            let res = await APIs.post(endpoints['dang_ky'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res.data);
            setLoading(false);
            if (res.status === 201) {
                console.error('Tạo tài khoản thành công!');
                e.preventDefault();
                nav("/sinh-vien-dang-ky", {state: { email: user.email }});
            }
        } catch (ex) {
            console.error('Có lỗi gì đó đã xảy ra trong lúc tạo tài khoản!', ex.message);
        } finally {
            setLoading(false);
        }
    };

    const login = (e) => {
        e.preventDefault();
        nav("/dang-nhap");
    };

    return (
        <div>
        <Container fluid className="registration-background">
            <Row className="justify-content-md-center">
                <Col md="8" lg="6">
                    <Card className="p-4 shadow-sm">
                        <Card.Body>
                            <h2 className="mb-4 text-center">Đăng Ký</h2>
                            {errors.avatar && <Alert variant="danger">{errors.avatar}</Alert>}
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ảnh đại diện</Form.Label>
                                    <Form.Control type="file" onChange={handleChooseAvatar} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Nhập email"
                                        value={user.email}
                                        onChange={handleEmailChange}
                                    />
                                    {errors.email && <Alert variant="danger">{errors.email}</Alert>}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập username"
                                        value={user.username}
                                        onChange={handleUsernameChange}
                                    />
                                    {errors.username && <Alert variant="danger">{errors.username}</Alert>}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        value={user.password}
                                        onChange={handlePasswordChange}
                                    />
                                    {errors.password && <Alert variant="danger">{errors.password}</Alert>}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập lại mật khẩu"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                    />
                                    {errors.confirmPassword && <Alert variant="danger">{errors.confirmPassword}</Alert>}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Check
                                        type="checkbox"
                                        label="Hiển thị mật khẩu"
                                        checked={showPassword}
                                        onChange={() => setShowPassword(!showPassword)}
                                    />
                                </Form.Group>
                                <div className="button-container">
                                    <Button variant="primary" type="button" onClick={validateDangKy} className="btn-lg" disabled={loading}>
                                        {loading ? <Spinner animation="border" size="sm" /> : "Đăng ký"}
                                    </Button>
                                </div>
                            </Form>
                            <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <p style={{ margin: 0 }}>Đã có tài khoản? <Button variant="link" className="p-0" onClick={login}> Đăng nhập</Button></p>
                            </div>
                            <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Nhập mã OTP</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="d-flex justify-content-center">
                                        {otp.map((o, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                value={o}
                                                onChange={(e) => handleChangeText(e.target.value, index)}
                                                ref={(el) => refs.current[index] = el}
                                                className="otp-input mx-2"
                                            />
                                        ))}
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Đóng
                                    </Button>
                                    <Button variant="primary" onClick={handleSubmit}>
                                        Xác nhận
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    </div>
    );
};

export default DangKy;

