import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Table, Alert } from 'react-bootstrap';
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import { useNavigate } from 'react-router-dom';

const DanhSachBaoThieu = () => {
    const [loading, setLoading] = useState(true);
    const [thamGiaBaoThieu, setThamGiaBaoThieu] = useState([]);
    const [hoatDongs, setHoatDongs] = useState([]);
    const [sv, setSv] = useState([]);
    const navigate = useNavigate();

    const fetchUserData = async () => {
        try {
            const reshd = await APIs.get(endpoints['hoatdong']);
            const ressv = await authAPI().get(endpoints['sinh_vien']);
            const restgbt = await APIs.get(endpoints['tham_gia_bao_thieu']);
            
            setHoatDongs(reshd.data);
            setSv(ressv.data);
            setThamGiaBaoThieu(restgbt.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách tham gia báo thiếu:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const findHoatDongName = (hoatdongId) => {
        const foundHoatDong = Array.isArray(hoatDongs) && hoatDongs.find(hd => hd.id === hoatdongId);
        return foundHoatDong ? foundHoatDong.ten_HD_NgoaiKhoa : "";
    };

    const findHoatDongDRL = (hoatdongId) => {
        const foundHoatDong = Array.isArray(hoatDongs) && hoatDongs.find(hd => hd.id === hoatdongId);
        return foundHoatDong ? foundHoatDong.diem_ren_luyen : "";
    };

    const findSinhVienName = (sinhvienId) => {
        const foundSinhVien = Array.isArray(sv) && sv.find(s => s.id === sinhvienId);
        return foundSinhVien ? `${foundSinhVien.ho_ten} (${foundSinhVien.mssv})` : "";
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container>
            <h1 className="text-center text-danger my-4">Danh sách hoạt động báo thiếu của sinh viên</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Tên hoạt động</th>
                        <th>ĐRL</th>
                        <th>Sinh Viên</th>
                    </tr>
                </thead>
                <tbody>
                    {thamGiaBaoThieu.map((tgbt) => (
                        <tr key={tgbt.id} onClick={() => navigate('/chi-tiet-bao-thieu', { state: { thamgiabaothieu_id: tgbt.id } })}>
                            <td>{findHoatDongName(tgbt.hd_ngoaikhoa)}</td>
                            <td className="text-center">{findHoatDongDRL(tgbt.hd_ngoaikhoa)}</td>
                            <td>{findSinhVienName(tgbt.sinh_vien)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default DanhSachBaoThieu;
