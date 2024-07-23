// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Button, Form, Spinner, Image, Alert } from 'react-bootstrap';
// import APIs, { endpoints, authAPI, formatDate } from '../../configs/APIs';

// const ChiTietBaoThieu = () => {
//     const location = useLocation();
//     const thamgiabaothieu_id = location.state?.thamgiabaothieu_id;
//     const navigate = useNavigate();

//     const [loading, setLoading] = useState(true);
//     const [buttonLoading, setButtonLoading] = useState({ hopLe: false, khongHopLe: false });
//     const [hoatDongs, setHoatDongs] = useState([]);
//     const [sv, setSv] = useState([]);
//     const [chiTietBaoThieu, setChiTietBaoThieu] = useState(null);
//     const [minhchung, setMinhChung] = useState({
//         description: "",
//         anh_minh_chung: "",
//         tham_gia: thamgiabaothieu_id,
//         phan_hoi: ""
//     });
//     const [isImageEnlarged, setIsImageEnlarged] = useState(false);
//     const [alertMessage, setAlertMessage] = useState('');
//     const [alertVariant, setAlertVariant] = useState('success');

//     const change = (field, value) => {
//         setMinhChung(current => ({ ...current, [field]: value }));
//     };

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const reshd = await APIs.get(endpoints['hoatdong']);
//                 const ressv = await authAPI().get(endpoints['sinh_vien']);
//                 const resctbt = await authAPI().get(`/thamgias/${thamgiabaothieu_id}/`);
//                 const resmc = await authAPI().get(`/thamgias/${thamgiabaothieu_id}/minhchungs/`);
//                 if (resmc.data.length > 0) {
//                     const minhChungData = resmc.data[0];
//                     setMinhChung({
//                         description: minhChungData.description,
//                         anh_minh_chung: minhChungData.anh_minh_chung,
//                         tham_gia: thamgiabaothieu_id,
//                         phan_hoi: minhChungData.phan_hoi,
//                     });
//                 }

//                 setHoatDongs(reshd.data);
//                 setSv(ressv.data);
//                 setChiTietBaoThieu(resctbt.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Lỗi khi lấy danh sách tham gia báo thiếu:", error);
//                 setAlertMessage('Lỗi khi lấy dữ liệu.');
//                 setAlertVariant('danger');
//                 setLoading(false);
//             }
//         };

//         fetchUserData();
//     }, [thamgiabaothieu_id]);

//     const PatchMinhChung = async () => {
//         try {
//             setLoading(true);
//             let form = new FormData();
//             for (let key in minhchung) {
//                 if (key === "anh_minh_chung") {
//                     form.append(key, minhchung.anh_minh_chung);
//                 } else {
//                     form.append(key, minhchung[key]);
//                 }
//             }
//             let res = await authAPI().patch((`/thamgias/${thamgiabaothieu_id}/capnhat/`), form, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });

//             setLoading(false);
//             if (res.status === 200) {
//                 setAlertMessage('Cập nhật minh chứng thành công!');
//                 setAlertVariant('success');
//                 navigate(-1);
//             }
//         } catch (ex) {
//             console.log(ex);
//             setAlertMessage('Có lỗi gì đó đã xảy ra trong lúc cập nhật minh chứng!');
//             setAlertVariant('danger');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handlePhanHoiChange = (e) => {
//         change('phan_hoi', e.target.value);
//     };

//     const updateTrangThaiKhongThanhCong = async () => {
//         try {
//             const updatedThamGia = { ...chiTietBaoThieu, trang_thai: 3 };
//             const res = await authAPI().patch(`/thamgias/${thamgiabaothieu_id}/`, updatedThamGia);
//             if (res.status === 200) {
//                 setChiTietBaoThieu(updatedThamGia);
//                 setAlertMessage('Cập nhật trạng thái thành công.');
//                 setAlertVariant('success');
//             }
//         } catch (error) {
//             console.error("Lỗi khi cập nhật trạng thái:", error);
//             setAlertMessage('Đã xảy ra lỗi khi cập nhật trạng thái.');
//             setAlertVariant('danger');
//         }
//     };

//     const updateTrangThaiThanhCong = async () => {
//         try {
//             const updatedThamGia = { ...chiTietBaoThieu, trang_thai: 1 };
//             const res = await authAPI().patch(`/thamgias/${thamgiabaothieu_id}/`, updatedThamGia);
//             if (res.status === 200) {
//                 setChiTietBaoThieu(updatedThamGia);
//                 const hoat_dong = chiTietBaoThieu.hd_ngoaikhoa
//                 const gethk_nh = await authAPI().get(`${endpoints['hd']}${hoat_dong}/`);
//                 const res = gethk_nh.data;
//                 await authAPI().post(`${endpoints['tinh_diem']}${chiTietBaoThieu.sinh_vien}/${res.hk_nh}/`);
//                 setAlertMessage('Cập nhật trạng thái thành công.');
//                 setAlertVariant('success');
//             }
//         } catch (error) {
//             console.error("Lỗi khi cập nhật trạng thái:", error);
//             setAlertMessage('Đã xảy ra lỗi khi cập nhật trạng thái.');
//             setAlertVariant('danger');
//         }
//     };

//     const handleSubmitHopLe = async () => {
//         if (!minhchung.phan_hoi) {
//             setAlertMessage('Vui lòng nhập phản hồi.');
//             setAlertVariant('warning');
//             return;
//         }
//         setButtonLoading({ ...buttonLoading, hopLe: true });
//         await updateTrangThaiThanhCong();
//         await PatchMinhChung();
//         setButtonLoading({ ...buttonLoading, hopLe: false });
//     };

//     const handleSubmitKhongHopLe = async () => {
//         if (!minhchung.phan_hoi) {
//             setAlertMessage('Vui lòng nhập phản hồi.');
//             setAlertVariant('warning');
//             return;
//         }
//         setButtonLoading({ ...buttonLoading, khongHopLe: true });
//         await updateTrangThaiKhongThanhCong();
//         await PatchMinhChung();
//         setButtonLoading({ ...buttonLoading, khongHopLe: false });
//     };

//     const findHoatDongInfo = (hoatdongId) => {
//         const foundHoatDong = Array.isArray(hoatDongs) && hoatDongs.find(hd => hd.id === hoatdongId);
//         if (foundHoatDong) {
//             return {
//                 name: foundHoatDong.ten_HD_NgoaiKhoa,
//                 drl: foundHoatDong.diem_ren_luyen,
//                 thongTin: foundHoatDong.thong_tin,
//                 ngayTC: foundHoatDong.ngay_to_chuc,
//                 dieu: foundHoatDong.dieu
//             };
//         }
//         return {
//             name: "",
//             drl: "",
//             thongTin: "",
//             ngayTC: "",
//             dieu: ""
//         };
//     };

//     const findSinhVienName = (sinhvienId) => {
//         const foundSinhVien = Array.isArray(sv) && sv.find(s => s.id === sinhvienId);
//         return foundSinhVien ? foundSinhVien.ho_ten : "";
//     };

//     if (loading) {
//         return (
//             <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//                 <Spinner animation="border" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </Spinner>
//             </Container>
//         );
//     }

//     const baoThieuInfo = findHoatDongInfo(chiTietBaoThieu.hd_ngoaikhoa);

//     const toggleImageSize = () => {
//         setIsImageEnlarged(!isImageEnlarged);
//     };

//     const handleImageChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             change('anh_minh_chung', e.target.files[0]);
//         }
//     };

//     return (
//         <Container className='mb-3 mt-3'>
//             <Row className="mb-3">
//                 <Col>
//                     <h3 className='text-center text-info'>Chi Tiết Báo Thiếu</h3>
//                 </Col>
//             </Row>
//             {alertMessage && (
//                 <Row className="mb-3">
//                     <Col>
//                         <Alert variant={alertVariant} onClose={() => setAlertMessage('')} dismissible>
//                             {alertMessage}
//                         </Alert>
//                     </Col>
//                 </Row>
//             )}
//             <Row className="mb-3">
//                 <Col md={6}><strong>Tên hoạt động:</strong> {baoThieuInfo.name}</Col>
//                 <Col md={6}><strong>Điểm rèn luyện:</strong> {baoThieuInfo.drl}</Col>
//             </Row>
//             <Row className="mb-3">
//                 <Col md={6}><strong>Thông tin hoạt động:</strong> {baoThieuInfo.thongTin}</Col>
//                 <Col md={6}><strong>Ngày tổ chức:</strong> {baoThieuInfo.ngayTC ? formatDate(baoThieuInfo.ngayTC) : ''}</Col>
//             </Row>
//             <Row className="mb-3">
//                 <Col md={6}><strong>Sinh viên:</strong> {findSinhVienName(chiTietBaoThieu.sinh_vien)}</Col>
//                 <Col md={6}><strong>Điều:</strong> {baoThieuInfo.dieu}</Col>
//             </Row>
//             <Row className="mb-3">
//                 <Col>
//                     <Form>
//                         {minhchung.anh_minh_chung && (
//                             <div className="text-center">
//                                 <Image
//                                     src={minhchung.anh_minh_chung}
//                                     alt="Minh chứng"
//                                     fluid
//                                     style={{ maxWidth: isImageEnlarged ? '100%' : '200px', cursor: 'pointer' }}
//                                     onClick={toggleImageSize}
//                                 />
//                             </div>
//                         )}
//                         <Form.Group className="mb-3">
//                             <Form.Label>Phản hồi</Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={3}
//                                 value={minhchung.phan_hoi}
//                                 onChange={handlePhanHoiChange}
//                             />
//                         </Form.Group>
//                         <div className="d-flex justify-content-between">
//                             <Button variant="success" onClick={handleSubmitHopLe} disabled={buttonLoading.hopLe}>
//                                 {buttonLoading.hopLe ? <Spinner animation="border" size="sm" /> : 'Hợp lệ'}
//                             </Button>
//                             <Button variant="danger" onClick={handleSubmitKhongHopLe} disabled={buttonLoading.khongHopLe}>
//                                 {buttonLoading.khongHopLe ? <Spinner animation="border" size="sm" /> : 'Không hợp lệ'}
//                             </Button>
//                         </div>
//                     </Form>
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default ChiTietBaoThieu;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Spinner, Image, Alert, Card } from 'react-bootstrap';
import APIs, { endpoints, authAPI, formatDate } from '../../configs/APIs';

const ChiTietBaoThieu = () => {
    const location = useLocation();
    const thamgiabaothieu_id = location.state?.thamgiabaothieu_id;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState({ hopLe: false, khongHopLe: false });
    const [hoatDongs, setHoatDongs] = useState([]);
    const [sv, setSv] = useState([]);
    const [chiTietBaoThieu, setChiTietBaoThieu] = useState(null);
    const [minhchung, setMinhChung] = useState({
        description: "",
        anh_minh_chung: "",
        tham_gia: thamgiabaothieu_id,
        phan_hoi: ""
    });
    const [isImageEnlarged, setIsImageEnlarged] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('success');

    const change = (field, value) => {
        setMinhChung(current => ({ ...current, [field]: value }));
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const reshd = await APIs.get(endpoints['hoatdong']);
                const ressv = await authAPI().get(endpoints['sinh_vien']);
                const resctbt = await authAPI().get(`/thamgias/${thamgiabaothieu_id}/`);
                const resmc = await authAPI().get(`/thamgias/${thamgiabaothieu_id}/minhchungs/`);
                if (resmc.data.length > 0) {
                    const minhChungData = resmc.data[0];
                    setMinhChung({
                        description: minhChungData.description,
                        anh_minh_chung: minhChungData.anh_minh_chung,
                        tham_gia: thamgiabaothieu_id,
                        phan_hoi: minhChungData.phan_hoi,
                    });
                }

                setHoatDongs(reshd.data);
                setSv(ressv.data);
                setChiTietBaoThieu(resctbt.data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tham gia báo thiếu:", error);
                setAlertMessage('Lỗi khi lấy dữ liệu.');
                setAlertVariant('danger');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [thamgiabaothieu_id]);

    const PatchMinhChung = async () => {
        try {
            setLoading(true);
            let form = new FormData();
            for (let key in minhchung) {
                if (key === "anh_minh_chung") {
                    form.append(key, minhchung.anh_minh_chung);
                } else {
                    form.append(key, minhchung[key]);
                }
            }
            let res = await authAPI().patch((`/thamgias/${thamgiabaothieu_id}/capnhat/`), form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setLoading(false);
            if (res.status === 200) {
                setAlertMessage('Cập nhật minh chứng thành công!');
                setAlertVariant('success');
                navigate(-1);
            }
        } catch (ex) {
            console.log(ex);
            setAlertMessage('Có lỗi gì đó đã xảy ra trong lúc cập nhật minh chứng!');
            setAlertVariant('danger');
        } finally {
            setLoading(false);
        }
    };

    const handlePhanHoiChange = (e) => {
        change('phan_hoi', e.target.value);
    };

    const updateTrangThaiKhongThanhCong = async () => {
        try {
            const updatedThamGia = { ...chiTietBaoThieu, trang_thai: 3 };
            const res = await authAPI().patch(`/thamgias/${thamgiabaothieu_id}/`, updatedThamGia);
            if (res.status === 200) {
                setChiTietBaoThieu(updatedThamGia);
                setAlertMessage('Cập nhật trạng thái thành công.');
                setAlertVariant('success');
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            setAlertMessage('Đã xảy ra lỗi khi cập nhật trạng thái.');
            setAlertVariant('danger');
        }
    };

    const updateTrangThaiThanhCong = async () => {
        try {
            const updatedThamGia = { ...chiTietBaoThieu, trang_thai: 1 };
            const res = await authAPI().patch(`/thamgias/${thamgiabaothieu_id}/`, updatedThamGia);
            if (res.status === 200) {
                setChiTietBaoThieu(updatedThamGia);
                const hoat_dong = chiTietBaoThieu.hd_ngoaikhoa
                const gethk_nh = await authAPI().get(`${endpoints['hd']}${hoat_dong}/`);
                const res = gethk_nh.data;
                await authAPI().post(`${endpoints['tinh_diem']}${chiTietBaoThieu.sinh_vien}/${res.hk_nh}/`);
                setAlertMessage('Cập nhật trạng thái thành công.');
                setAlertVariant('success');
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            setAlertMessage('Đã xảy ra lỗi khi cập nhật trạng thái.');
            setAlertVariant('danger');
        }
    };

    const handleSubmitHopLe = async () => {
        if (!minhchung.phan_hoi) {
            setAlertMessage('Vui lòng nhập phản hồi.');
            setAlertVariant('warning');
            return;
        }
        setButtonLoading({ ...buttonLoading, hopLe: true });
        await updateTrangThaiThanhCong();
        await PatchMinhChung();
        setButtonLoading({ ...buttonLoading, hopLe: false });
    };

    const handleSubmitKhongHopLe = async () => {
        if (!minhchung.phan_hoi) {
            setAlertMessage('Vui lòng nhập phản hồi.');
            setAlertVariant('warning');
            return;
        }
        setButtonLoading({ ...buttonLoading, khongHopLe: true });
        await updateTrangThaiKhongThanhCong();
        await PatchMinhChung();
        setButtonLoading({ ...buttonLoading, khongHopLe: false });
    };

    const findHoatDongInfo = (hoatdongId) => {
        const foundHoatDong = Array.isArray(hoatDongs) && hoatDongs.find(hd => hd.id === hoatdongId);
        if (foundHoatDong) {
            return {
                name: foundHoatDong.ten_HD_NgoaiKhoa,
                drl: foundHoatDong.diem_ren_luyen,
                thongTin: foundHoatDong.thong_tin,
                ngayTC: foundHoatDong.ngay_to_chuc,
                dieu: foundHoatDong.dieu
            };
        }
        return {
            name: "",
            drl: "",
            thongTin: "",
            ngayTC: "",
            dieu: ""
        };
    };

    const findSinhVienName = (sinhvienId) => {
        const foundSinhVien = Array.isArray(sv) && sv.find(s => s.id === sinhvienId);
        return foundSinhVien ? foundSinhVien.ho_ten : "";
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    const baoThieuInfo = findHoatDongInfo(chiTietBaoThieu.hd_ngoaikhoa);

    const toggleImageSize = () => {
        setIsImageEnlarged(!isImageEnlarged);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            change('anh_minh_chung', e.target.files[0]);
        }
    };

    return (
        <Container className="mb-3 mt-3">
            <Card>
                <Card.Header className="bg-primary text-white text-center">
                    <h2>Chi Tiết Báo Thiếu</h2>
                </Card.Header>
                <Card.Body>
                    {alertMessage && (
                        <Alert variant={alertVariant} onClose={() => setAlertMessage('')} dismissible>
                            {alertMessage}
                        </Alert>
                    )}
                    <Row className="mb-3">
                        <Col md={6}><strong>Tên hoạt động:</strong> {baoThieuInfo.name}</Col>
                        <Col md={6}><strong>Điểm rèn luyện:</strong> {baoThieuInfo.drl}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}><strong>Thông tin hoạt động:</strong> {baoThieuInfo.thongTin}</Col>
                        <Col md={6}><strong>Ngày tổ chức:</strong> {baoThieuInfo.ngayTC ? formatDate(baoThieuInfo.ngayTC) : ''}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}><strong>Sinh viên:</strong> {findSinhVienName(chiTietBaoThieu.sinh_vien)}</Col>
                        <Col md={6}><strong>Điều:</strong> {baoThieuInfo.dieu}</Col>
                    </Row>
                    <Form>
                        {minhchung.anh_minh_chung && (
                            <div className="text-center mb-3">
                                <Image
                                    src={minhchung.anh_minh_chung}
                                    alt="Minh chứng"
                                    fluid
                                    style={{ maxWidth: isImageEnlarged ? '100%' : '500px', cursor: 'pointer' }}
                                    onClick={toggleImageSize}
                                />
                            </div>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Phản hồi:</strong> </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={minhchung.phan_hoi}
                                onChange={handlePhanHoiChange}
                                placeholder="Nhập phản hồi của bạn"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                            <Button variant="success" onClick={handleSubmitHopLe} disabled={buttonLoading.hopLe}>
                                {buttonLoading.hopLe ? <Spinner animation="border" size="sm" /> : 'Hợp lệ'}
                            </Button>
                            <Button variant="danger" onClick={handleSubmitKhongHopLe} disabled={buttonLoading.khongHopLe}>
                                {buttonLoading.khongHopLe ? <Spinner animation="border" size="sm" /> : 'Không hợp lệ'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ChiTietBaoThieu;
