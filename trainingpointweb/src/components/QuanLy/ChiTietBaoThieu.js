import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Spinner, Image, Alert } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import APIs from '../../configs/APIs';
import APIs, { endpoints, authAPI } from '../../configs/APIs';

const ChiTietBaoThieu = () => {
    const location = useLocation();

    const thamgiabaothieu_id = location.state?.thamgiabaothieu_id;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [hoatDongs, setHoatDongs] = useState([]);
    const [sv, setSv] = useState([]);
    const [chiTietBaoThieu, setChiTietBaoThieu] = useState(null);
    const [minhchung, setMinhChung] = useState({
        "description": "",
        "anh_minh_chung": "",
        "tham_gia": thamgiabaothieu_id,
        "phan_hoi": ""
    });

    const [isImageEnlarged, setIsImageEnlarged] = useState(false);

    const change = (field, value) => {
        setMinhChung(current => ({ ...current, [field]: value }));
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const reshd = await APIs.get(endpoints['hoatdong']);
                const ressv = await authAPI().get(endpoints['sinh_vien']);
                const resctbt = await authAPI().get(`/api/thamgias/${thamgiabaothieu_id}`);
                const resmc = await authAPI().get(`/api/thamgias/${thamgiabaothieu_id}/minhchungs/`);
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
            let res = await authAPI().patch((`thamgias/${thamgiabaothieu_id}/capnhat/`), form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setLoading(false);
            if (res.status === 200) {
                Alert.alert('Cập nhật minh chứng thành công!');
                navigate(-1);
            }
        } catch (ex) {
            console.log(ex);
            Alert.alert('Có lỗi gì đó đã xảy ra trong lúc cập nhật minh chứng!', ex.message);
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
                
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            Alert.alert("Đã xảy ra lỗi khi cập nhật trạng thái.");
        }
    };

    const updateTrangThaiThanhCong = async () => {
        try {
            const token = localStorage.getItem("access-token");
            const updatedThamGia = { ...chiTietBaoThieu, trang_thai: 1 };
            const res = await authAPI().patch(`/thamgias/${thamgiabaothieu_id}/`, updatedThamGia);
            if (res.status === 200) {
                setChiTietBaoThieu(updatedThamGia);
                const hoat_dong = chiTietBaoThieu.hd_ngoaikhoa
                const gethk_nh = await authAPI().get(`${endpoints['hd']}${hoat_dong}/`);
                const res = gethk_nh.data;
                await authAPI().post(`${endpoints['tinh_diem']}${chiTietBaoThieu.sinh_vien}/${res.hk_nh}/`);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            Alert.alert("Đã xảy ra lỗi khi cập nhật trạng thái.");
        }
    };

    const handleSubmitHopLe = async () => {
        if (!minhchung.phan_hoi) {
            Alert.alert("Vui lòng nhập phản hồi.");
            return;
        }

        await updateTrangThaiThanhCong();
        await PatchMinhChung();
    };

    const handleSubmitKhongHopLe = async () => {
        if (!minhchung.phan_hoi) {
            Alert.alert("Vui lòng nhập phản hồi.");
            return;
        }

        await updateTrangThaiKhongThanhCong();
        await PatchMinhChung();
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

    return (
        <Container>
            <Row className="mb-3">
                <Col>
                    <h3>Chi Tiết Báo Thiếu</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Hoạt động ngoại khóa:</Form.Label>
                        <Form.Control type="text" readOnly value={baoThieuInfo.name} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Điểm rèn luyện:</Form.Label>
                        <Form.Control type="text" readOnly value={baoThieuInfo.drl} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Chi tiết:</Form.Label>
                        <Form.Control type="text" readOnly value={baoThieuInfo.thongTin} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Ngày tổ chức:</Form.Label>
                        <Form.Control type="text" readOnly value={baoThieuInfo.ngayTC} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Điều:</Form.Label>
                        <Form.Control type="text" readOnly value={baoThieuInfo.dieu} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Sinh Viên:</Form.Label>
                        <Form.Control type="text" readOnly value={findSinhVienName(chiTietBaoThieu.sinh_vien)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={minhchung.description}
                            onChange={(e) => change('description', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Phản hồi:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={minhchung.phan_hoi}
                            onChange={handlePhanHoiChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Ảnh minh chứng:</Form.Label>
                        {minhchung.anh_minh_chung ? (
                            <Image
                                src={minhchung.anh_minh_chung}
                                alt="Ảnh minh chứng"
                                fluid
                                onClick={toggleImageSize}
                                style={{ cursor: 'pointer', maxWidth: isImageEnlarged ? '100%' : '200px' }}
                            />
                        ) : (
                            <Form.Control
                                type="file"
                                onChange={(e) => change('anh_minh_chung', e.target.files[0])}
                            />
                        )}
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex justify-content-end">
                    <Button variant="success" className="me-2" onClick={handleSubmitHopLe}>Hợp lệ</Button>
                    <Button variant="danger" onClick={handleSubmitKhongHopLe}>Không hợp lệ</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ChiTietBaoThieu;
