import React, { useState, useEffect } from 'react';
import { Button, Spinner, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import './Styles.css';

const DiemDanh = () => {
    const [file, setFile] = useState(null);
    const [hocKyList, setHocKyList] = useState([]);
    const [hoatdong, setHoatDong] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hockyselected, setHockyselected] = useState(null);
    const [hoatdongselected, setHoatDongSelected] = useState(null);
    const [mssv, setMssv] = useState("");
    const [alertMessage, setAlertMessage] = useState(null);
    const [method, setMethod] = useState("mssv"); // 'mssv' or 'file'

    const fetchHoatDong = async (hocKyId) => {
        try {
            const response = await authAPI().get(`${endpoints['upload_diem_danh']}?hoc_ky=${hocKyId}`);
            const sortedHoatDong = response.data.sort((a, b) => new Date(b.ngay_to_chuc) - new Date(a.ngay_to_chuc));
            setHoatDong(sortedHoatDong);
            setLoading(false);
        } catch (err) {
            alert('Error fetching hoat dong data: ' + err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchHocKy = async () => {
            try {
                const response = await APIs.get(endpoints['hocky']);
                setHocKyList(response.data);
                setLoading(false);
            } catch (err) {
                alert('Error fetching hoc ky data: ' + err.message);
                setLoading(false);
            }
        };

        fetchHocKy();
    }, []);

    useEffect(() => {
        if (hockyselected) {
            fetchHoatDong(hockyselected);
        }
    }, [hockyselected]);

    const removeFile = () => {
        setFile(null);
    };

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const uploadFile = async () => {
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await authAPI().post(endpoints['diemdanh'](hoatdongselected, hockyselected), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                alert('Tải file điểm danh lên hệ thống thành công');
                removeFile();
            } else {
                alert('Failed to upload file: ' + response.data.error);
            }
        } catch (err) {
            if (err.response) {
                alert('Error ' + err.response.status + ': ' + err.response.data.error || err.response.data.message);
            } else {
                alert('Error: ' + err.message);
            }
        }
    };

    const handleDiemDanhMSSV = async () => {
        if (!hoatdongselected || !mssv) {
            alert('Vui lòng chọn hoạt động và nhập MSSV');
            return;
        }

        try {
            const response = await authAPI().post('https://sonpnts.pythonanywhere.com/hoatdongs/diemdanhsv/', {
                hoatdong: hoatdongselected,
                mssv: mssv
            });

            if (response.status === 200) {
                setAlertMessage(`Đã điểm danh cho sinh viên MSSV: ${mssv}`);
                setMssv(""); // Reset MSSV sau khi gửi thành công
                setTimeout(() => setAlertMessage(null), 2000); // Ẩn thông báo sau 2 giây
            } else {
                alert('Error: ' + response.data.error);
            }
        } catch (err) {
            if (err.response) {
                alert('Error ' + err.response.status + ': ' + err.response.data.error || err.response.data.message);
            } else {
                alert('Error: ' + err.message);
            }
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const dropzoneStyle = {
        border: '2px dashed #007bff',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: '5px',
    };

    return (
        <div>
            <div fluid className="registration-background">
                <Container>
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center vh-100">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <>
                            <Row className="mb-4">
                                <Col>
                                    <Form.Group controlId="hocKySelect">
                                        <Form.Label>Chọn học kỳ</Form.Label>
                                        <Form.Control as="select" value={hockyselected} onChange={(e) => setHockyselected(e.target.value)}>
                                            <option value="">Chọn học kỳ</option>
                                            {hocKyList.map((hocKyItem, index) => (
                                                <option key={index} value={hocKyItem.id}>
                                                    Học kỳ {hocKyItem.hoc_ky} - {hocKyItem.nam_hoc}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-4">
                                <Col>
                                    <Form.Group controlId="hoatDongSelect">
                                        <Form.Label>Chọn hoạt động</Form.Label>
                                        <Form.Control as="select" value={hoatdongselected} onChange={(e) => setHoatDongSelected(e.target.value)}>
                                            <option value="">Chọn hoạt động</option>
                                            {hoatdong.map(activity => (
                                                <option key={activity.id} value={activity.id}>
                                                    {activity.ten_HD_NgoaiKhoa}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Thêm lựa chọn phương thức */}
                            <Row className="mb-4">
                                <Col>
                                    <Form.Check
                                        type="radio"
                                        label="Điểm danh bằng MSSV"
                                        name="method"
                                        value="mssv"
                                        checked={method === "mssv"}
                                        onChange={() => setMethod("mssv")}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Tải file lên"
                                        name="method"
                                        value="file"
                                        checked={method === "file"}
                                        onChange={() => setMethod("file")}
                                    />
                                </Col>
                            </Row>

                            {/* Hiển thị phần nhập MSSV nếu chọn điểm danh bằng MSSV */}
                            {method === "mssv" && (
                                <Row className="mb-4">
                                    <Col>
                                        <Form.Group controlId="mssvInput">
                                            <Form.Label>Nhập MSSV</Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Nhập MSSV" 
                                                value={mssv}
                                                onChange={(e) => setMssv(e.target.value)}
                                                disabled={!hoatdongselected}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}

                            {/* Hiển thị phần tải file nếu chọn tải file */}
                            {method === "file" && (
                                <>
                                    <Row className="mb-4">
                                        <Col>
                                            <div {...getRootProps({ style: dropzoneStyle })}>
                                                <input {...getInputProps()} />
                                                <p>Kéo và thả file vào đây, hoặc bấm để chọn file</p>
                                            </div>
                                        </Col>
                                    </Row>

                                    {file && (
                                        <Row className="mb-4">
                                            <Col>
                                                <div className="d-flex align-items-center">
                                                    <span className="me-2">File đã chọn: {file.name}</span>
                                                    <Button variant="danger" onClick={removeFile}>
                                                        Xóa
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    )}
                                </>
                            )}

                            <Row>
                                {method === "file" && (
                                    <Col>
                                        <Button variant="success" onClick={uploadFile}>
                                            Tải File Lên
                                        </Button>
                                    </Col>
                                )}
                                {method === "mssv" && (
                                    <Col>
                                        <Button variant="primary" onClick={handleDiemDanhMSSV}>
                                            Gửi MSSV
                                        </Button>
                                    </Col>
                                )}
                            </Row>

                            {alertMessage && (
                                <Row className="mt-4">
                                    <Col>
                                        <Alert variant="success">{alertMessage}</Alert>
                                    </Col>
                                </Row>
                            )}
                        </>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default DiemDanh;
