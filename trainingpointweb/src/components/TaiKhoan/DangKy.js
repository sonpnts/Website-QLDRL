import React, { useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Alert, Spinner, Modal, Card } from "react-bootstrap";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigate } from "react-router-dom";
import sendEmail from "./send_mail";
import Styles from './Styles.css';

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
                    // console.log(res);
                    if (res === true) {
                        tk_valid= true;
                        
                    }
                }
            } catch (ex) {
                setLoading(false);
                console.error('Có lỗi gì đó đã xảy ra', 'Tài khoản sinh viên đã tồn tại!');
            }
            console.log(tk_valid);
            if (!tk_valid) {
                setLoading(true);
               
                try {
                    const otp = generateOTP(); // Tạo và lưu OTP ngẫu nhiên
                    const body = "Mã OTP của bạn là:" + otp;
                    const header = "Xác thực mã OTP tạo tài khoản sinh viên";
                    const res = await sendEmail(user.email, header, body); // Gửi email chứa OTP
                    if (res.status === 200) {
                        // console.log(otp);
                        console.log('Gửi email thành công!',otp);
                        setLoading(false);
                        handleShow();
                    }
                    // nav("/otp", { state: { email: user.email, otp: otp } }); // Điều hướng đến màn hình OTP với thông tin email và otp
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
            // setSuccess(true); // OTP matched, proceed with registration
            handleClose(); // Close modal after successful OTP verification
            PostTaiKhoan();
        } else {
            alert('Mã OTP không chính xác. Vui lòng kiểm tra lại.');
        }
    };

   

    const PostTaiKhoan = async () => {
        
        try {
            setLoading(true);
            let form = new FormData();
            console.log(user);
            for (let key in user) {
                if (key === "avatar") {
                    form.append(key, user.avatar);
                } else {
                    form.append(key, user[key]);
                }
            }
            console.log("FormData:", form);
            let res = await APIs.post(endpoints['dang_ky'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setLoading(false);
            if (res.status === 201) {
                console.error('Tạo tài khoản thành công!');
                nav("/sinh-vien-dang-ky", {state: { email: user.email }});
            }

        } catch (ex) {
            // console.log(ex);
            console.error('Có lỗi gì đó đã xảy ra trong lúc tạo tài khoản!', ex.message);
        } finally {
            setLoading(false);
        }
        
    };

    const login = () => {
        nav("/dang-nhap");
    };


    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md="6">
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
                                        placeholder="Nhập tên đăng nhập"
                                        value={user.username}
                                        onChange={handleUsernameChange}
                                    />
                                    {errors.username && <Alert variant="danger">{errors.username}</Alert>}
                                </Form.Group>
                                <Form.Group className="mb-3 position-relative" controlId="formBasicPasswordInput">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        value={user.password}
                                        onChange={handlePasswordChange}
                                    />
                                    <div className="position-absolute end-0 bottom-50 translate-middle-y">
                                        <Form.Check
                                            id="formBasicShowPasswordCheckbox"
                                            type="checkbox"
                                            className="cursor-pointer"
                                            label={<i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>}
                                            onChange={() => setShowPassword(!showPassword)}
                                        />
                                    </div>
                                    {errors.password && <Alert variant="danger">{errors.password}</Alert>}
                                </Form.Group>

                                <Form.Group className="mb-3 position-relative" controlId="formConfirmPassword">
                                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Xác nhận mật khẩu"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                    />
                                    <div className="position-absolute end-0 bottom-50 translate-middle-y">
                                        <Form.Check
                                            id="formConfirmShowPasswordCheckbox"
                                            type="checkbox"
                                            className="cursor-pointer"
                                            label={<i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>}
                                            onChange={() => setShowPassword(!showPassword)}
                                        />
                                    </div>
                                    {errors.confirmPassword && <Alert variant="danger">{errors.confirmPassword}</Alert>}
                                </Form.Group>

                                {loading ? <Spinner animation="border" /> :
                                    <>
                                        <Button variant="outline-primary" className="mb-3 w-100" onClick={validateDangKy}>
                                            Đăng ký
                                        </Button>
                                    </>
                                }
                                <Button variant="outline-secondary" className="mb-3 w-100" onClick={login}>
                                    Đã có tài khoản? Đăng nhập
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Nhập mã OTP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className={`${Styles.modalForm}`}>
                        <Form.Group className={`${Styles.otpInputGroup} d-flex justify-content-center`}>
                            {otp.map((value, index) => (
                                <Form.Control
                                    key={index}
                                    ref={ref => refs.current[index] = ref}
                                    className={`${Styles.OTP_input} mx-1`}
                                    value={value}
                                    onChange={(e) => handleChangeText(e.target.value, index)}
                                    type="number"
                                    maxLength={1}
                                />
                            ))}
                        </Form.Group>
                    </Form>
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
        </Container>
    );
};

export default DangKy;