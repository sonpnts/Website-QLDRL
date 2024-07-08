// import React, { useRef, useState, useEffect } from 'react';
// import { Container, Row, Col, Button, Form } from 'react-bootstrap'; // Import các thành phần từ Bootstrap
// // import axios from 'axios';
// import APIs, { endpoints } from '../../configs/APIs';
// // import Styles from './Styles';
// import { useNavigate, useLocation} from 'react-router-dom';


// const OTP = () => {
//     const [otp, setOtp] = useState(['', '', '', '']);
//     const [randomOTP, setRandomOTP] = useState(null);
//     const refs = useRef([]);
//     const nav = useNavigate();
//     const location = useLocation();

//     const email = location.state?.email;
//     useEffect(() => {
//         let randomNumber = Math.floor(Math.random() * 10000);
//         let otpNum = randomNumber.toString().padStart(4, '0');
//         setRandomOTP(otpNum);
//     }, []);

//     useEffect(() => {
//         if (randomOTP && email) {
//             console.log(randomOTP);
//             console.log(email);
//             sendEmail(email);
//         }
//     }, [randomOTP, email]);
//     // Hàm gửi mail
//     const sendEmail = async (email) => {
//         try {
//             await APIs.post(endpoints['send_mail'], {
//                 subject: 'Xác thực mã OTP tạo tài khoản sinh viên',
//                 message: `Mã OTP của bạn là ${randomOTP}`,
//                 recipient: email,
//             });
//             // console.log(response.data); // In ra dữ liệu trả về từ Django
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     // Hàm xử lý thay đổi giá trị của mỗi ô nhập
//     const handleChangeText = (num, index) => {
//         if (/^\d*$/.test(num) && num.length <= 1) {
//             const newOtp = [...otp];
//             newOtp[index] = num;
//             setOtp(newOtp);

//             if (index < otp.length - 1 && num.length === 1) {
//                 // Check if the ref is defined before calling focus()
//                 if (refs.current[index + 1]) {
//                     refs.current[index + 1].focus();
//                 }
//             }
//         }
//     };

//     // Xử lý khi nhấn nút Xác nhận
//     const handleSubmit = () => {
//         const otpString = otp.join('');
//         if (otpString === randomOTP) {
//             nav('/dang-ky', { state: { success: true } });
//         } else {
//             console.error("Mã OTP nhập không đúng!", "Vui lòng kiểm tra lại OTP");
//         }
//     };

//     return (
//         <Container className={`${Styles.container} ${Styles.align_item_center} ${Styles.justify_content_center}`}>
//             <h2 className={`${Styles.margin_bottom_40} ${Styles.subject}`}>Nhập mã OTP</h2>
//             <Row className="justify-content-center align-items-center mb-4">
//                 {otp.map((value, index) => (
//                     <Col key={index}>
//                         <Form.Control
//                             ref={ref => refs.current[index] = ref}
//                             className={Styles.OTP_input}
//                             value={value}
//                             onChange={(e) => handleChangeText(e.target.value, index)}
//                             type="number"
//                             maxLength={1}
//                             onKeyDown={(e) => {
//                                 if (e.keyCode === 13 && index < otp.length - 1) {
//                                     refs.current[index + 1].focus();
//                                 }
//                             }}
//                         />
//                     </Col>
//                 ))}
//             </Row>
//             <Row className="justify-content-center mb-5">
//                 <Button className="btn btn-primary" onClick={handleSubmit}>Xác nhận</Button>
//             </Row>
//         </Container>
//     );
// };

// export default OTP;
