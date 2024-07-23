import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Container, Row, Col, Form, Table, Alert } from 'react-bootstrap';
import APIs, { endpoints, BASE_URL, authAPI } from '../../configs/APIs';
import FileSaver from 'file-saver';
import Footer1 from './Footer1';
import './Styles.css';

const ThanhTichNgoaiKhoa = () => {
    const location = useLocation();
    const sinhvien_id = location.state?.sinhvien_id;
    const [selectedHocKyNamHoc, setSelectedHocKyNamHoc] = useState('');
    const [hocKyNamHocs, setHocKyNamHocs] = useState([]);
    const [sv, setSv] = useState(null);
    const [hoatDongDiemDanh, setHoatDongDiemDanh] = useState([]);
    const [dieus, setDieus] = useState([]);
    const [diemRenLuyen, setDiemRenLuyen] = useState('');
    const [lops, setLops] = useState([]);
    const [error, setError] = useState(null);

    const xepLoaiMap = {
        1: 'Xuất Sắc',
        2: 'Giỏi',
        3: 'Khá',
        4: 'Trung Bình',
        5: 'Yếu',
        6: 'Kém'
    };

    const fetchHocKyNamHocs = async () => {
        try {
            const response = await APIs.get(endpoints['hoc_ky_nam_hoc']);
            setHocKyNamHocs(response.data);
        } catch (error) {
            setError('Không thể tải dữ liệu học kỳ năm học');
            console.error(error);
        }
    };

    const fetchDieus = async () => {
        try {
            const response = await APIs.get(endpoints['dieu']);
            setDieus(response.data);
        } catch (error) {
            setError('Đã xảy ra lỗi khi tải dữ liệu Dieus.');
            console.error(error);
        }
    };

    const fetchLops = async () => {
        try {
            const resLop = await APIs.get(endpoints['lop']);
            setLops(resLop.data.results);
        } catch (error) {
            setError('Đã xảy ra lỗi khi tải dữ liệu Lớp.');
            console.error(error);
        }
    };

    const fetchSinhVien = async (sinhvien_id) => {
        try {
            const response = await authAPI().get(`${endpoints['sinh_vien']}${sinhvien_id}/`); 
            setSv(response.data);
        } catch (error) {
            setError('Không thể tải thông tin sinh viên');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchHocKyNamHocs();
        fetchDieus();
        fetchLops();
        fetchSinhVien(sinhvien_id);
    }, [sinhvien_id]);

    const handleViewReport = async (id) => {
        if (!selectedHocKyNamHoc || !sv) {
            setError('Vui lòng chọn đầy đủ thông tin');
            return;
        }
        try {
            const resHoatDongDiemDanh = await APIs.get(`/thamgias/hoat-dong-diem-danh/${sv.id}/${id}/`);
            setHoatDongDiemDanh(resHoatDongDiemDanh.data);

            try{
                const resDiemRenLuyen = await APIs.get(`/diemrenluyens/${sv.id}/${id}/`);
                if (resDiemRenLuyen.status === 200)
                    setDiemRenLuyen(resDiemRenLuyen.data);
            } catch {
                setError('Sinh viên không có điểm ở kỳ này');
            }

        } catch (error) {
            setError('Đã xảy ra lỗi khi tải dữ liệu điểm rèn luyện');
            console.error(error);
        }
    };

    useEffect(() => {
        if (selectedHocKyNamHoc)
            handleViewReport(selectedHocKyNamHoc);
        setDiemRenLuyen('');
    },[selectedHocKyNamHoc]);

    const findClassName = (classId) => {
        const foundClass = Array.isArray(lops) && lops.find(lop => lop.id === classId);
        return foundClass ? foundClass.ten_lop : "";
    };

    const filteredDieus = dieus.filter(dieu =>
        hoatDongDiemDanh.some(hoatDong => hoatDong.dieu == dieu.ma_dieu)
    );

    const handleExportReport = async (format) => {
        try {
            const formatValue = format === 'csv' ? 1 : 2;

            let url = `${BASE_URL}bao-cao-chi-tiet/${sv.id}/${selectedHocKyNamHoc}/${formatValue}/`;

            const response = await authAPI().get(url, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            FileSaver.saveAs(blob, `bao_cao_${format}.${format}`);
        } catch (error) {
            setError(error.message);
            console.error(error);
        }
    };

    return (
        <div>
            <div>


        <Container>
            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

            <Row className="mt-4">
                <Col>
                    <Form.Group>
                        <Form.Label>Chọn học kỳ năm học</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedHocKyNamHoc}
                            onChange={(e) => setSelectedHocKyNamHoc(e.target.value)}
                        >
                            <option value="">Chọn học kỳ năm học</option>
                            {hocKyNamHocs.map(hocKyNamHoc => (
                                <option key={hocKyNamHoc.id} value={hocKyNamHoc.id}>
                                    {hocKyNamHoc.hoc_ky} - {hocKyNamHoc.nam_hoc}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <h4>Thông tin sinh viên</h4>
                    {sv ? (
                        <div>
                            <p><strong>Họ và tên:</strong> {sv.ho_ten}</p>
                            <p><strong>Lớp:</strong> {findClassName(sv.lop)}</p>
                            <p><strong>MSSV:</strong> {sv.mssv}</p>
                        </div>
                    ) : (
                        <p>Không tìm thấy thông tin sinh viên</p>
                    )}
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <Button variant="primary" onClick={() => handleExportReport('pdf')}>Xuất PDF</Button>{' '}
                    <Button variant="primary" onClick={() => handleExportReport('csv')}>Xuất CSV</Button>
                </Col>
            </Row>

            <Row>
                <Col>
                    <h5>DS hoạt động ngoại khóa đã tham gia:</h5>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Điều</th>
                                <th>Tên Điều</th>
                                <th>Điểm tối đa</th>
                                <th>Hoạt động</th>
                                <th>Điểm rèn luyện</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDieus.map((dieu, index) => (
                                <tr key={index}>
                                    <td>{dieu.ma_dieu}</td>
                                    <td>{dieu.ten_dieu}</td>
                                    <td>{dieu.diem_toi_da}</td>
                                    <td colSpan="2">
                                        <Table>
                                            <tbody>
                                                {hoatDongDiemDanh.filter(hoatDong => hoatDong.dieu == dieu.ma_dieu).map((hoatDong, idx) => (
                                                    <tr key={idx}>
                                                        <td>{hoatDong.ten_HD_NgoaiKhoa}</td>
                                                        <td>{hoatDong.diem_ren_luyen}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Row>
                <Col>
                    <h5>Tổng kết</h5>
                    <p><strong>Tổng điểm rèn luyện:</strong> {diemRenLuyen?.diem_tong || 0}</p>
                    <p><strong>Xếp loại:</strong> {xepLoaiMap[diemRenLuyen?.xep_loai] || "Chưa có"}</p>
                </Col>
            </Row>
        </Container>
        </div>
        <br></br>
        <Footer1/>
        </div>
    );
};

export default ThanhTichNgoaiKhoa;
