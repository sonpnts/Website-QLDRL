import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import cookie from 'react-cookies';
import './Styles.css';

const BASE_URL = 'https://sonpnts.pythonanywhere.com/';

const trangThaiMap = {
    0: 'Đăng Ký',
    1: 'Điểm Danh',
    2: 'Báo Thiếu',
    3: 'Báo Thiếu Bị Từ Chối',
};

const HDNKChuaDiemDanh = () => {
    const [loading, setLoading] = useState(true);
    const [hoatDongChuaDiemDanh, setHoatDongChuaDiemDanh] = useState([]);
    const [user, setUser] = useState(null);
    const [sv, setSv] = useState(null);
    const [lops, setLops] = useState([]);
    const [selectedHocKyNamHoc, setSelectedHocKyNamHoc] = useState('');
    const [hocKyNamHocs, setHocKyNamHocs] = useState([]);
    const [hoatDongs, setHoatDongs] = useState([]);

    const authAPI = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${cookie.load('token')}`,
        },
    });

    const fetchHocKyNamHocs = async () => {
        try {
            const response = await authAPI.get('/hockinamhocs/');
            setHocKyNamHocs(response.data);
        } catch (error) {
            console.error('Error fetching hoc ky nam hocs:', error);
            alert('Không thể tải dữ liệu học kỳ năm học.');
        }
    };

    const fetchUserData = async () => {
        try {
            const [reslop, reshd, ressv] = await Promise.all([
                authAPI.get('/lops/'),
                authAPI.get('/hoatdongs/'),
                authAPI.get('/sinhviens/current-sinhvien/'),
            ]);

            setLops(reslop.data.results);
            setHoatDongs(reshd.data);
            setSv(ressv.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Lỗi khi lấy thông tin người dùng.');
            setLoading(false);
        }
    };

    const handleViewReport = async (id) => {
        if (!id) {
            alert('Vui lòng chọn đầy đủ thông tin.');
            return;
        }

        try {
            const response = await authAPI.get(`/thamgias/hoat-dong-chua-diem-danh/${sv.id}/${id}`);
            setHoatDongChuaDiemDanh(response.data);
        } catch (error) {
            console.error('Error fetching hoat dong chua diem danh:', error);
            alert('Đã xảy ra lỗi khi tải dữ liệu hoạt động.');
        }
    };

    const findClassName = (classId) => {
        const foundClass = lops.find(lop => lop.id === classId);
        return foundClass ? foundClass.ten_lop : '';
    };

    const findHoatDongName = (hoatdongId) => {
        const foundHoatDong = hoatDongs.find(hd => hd.id === hoatdongId);
        return foundHoatDong ? foundHoatDong.ten_HD_NgoaiKhoa : '';
    };

    const findHoatDongDRL = (hoatdongId) => {
        const foundHoatDong = hoatDongs.find(hd => hd.id === hoatdongId);
        return foundHoatDong ? foundHoatDong.diem_ren_luyen : '';
    };

    useEffect(() => {
        fetchHocKyNamHocs();
        fetchUserData();
    }, []);

    useEffect(() => {
        if (selectedHocKyNamHoc) {
            handleViewReport(selectedHocKyNamHoc);
        }
    }, [selectedHocKyNamHoc]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <div style={{padding: 15, backgroundColor: '#fff'}}>
            <div className="filter-section">
                <select
                    id="idHocKyNamHoc"
                    className="form-select form-select-lg mb-3"
                    value={selectedHocKyNamHoc}
                    onChange={(e) => setSelectedHocKyNamHoc(e.target.value)}
                >
                    <option value="">-- Chọn học kỳ năm học --</option>
                    {hocKyNamHocs.map((hk) => (
                        <option key={hk.id} value={hk.id}>
                            {hk.ten_hoc_ky_nam_hoc}
                        </option>
                    ))}
                </select>
                <button type="button" className="btn btn-success" onClick={() => handleViewReport(selectedHocKyNamHoc)}>
                    Tải lại báo cáo
                </button>
            </div>

            <div className="report-section">
                {hoatDongChuaDiemDanh.length === 0 ? (
                    <p>Không có dữ liệu báo cáo cho học kỳ năm học này.</p>
                ) : (
                    <table className="table table-bordered table-hover table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Mã Sinh Viên</th>
                                <th>Họ và Tên</th>
                                <th>Lớp</th>
                                <th>Tên Hoạt Động</th>
                                <th>Trạng Thái</th>
                                <th>Điểm Rèn Luyện</th>
                                <th>Thời Gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hoatDongChuaDiemDanh.map((thamgia, index) => (
                                <tr key={thamgia.id}>
                                    <td>{index + 1}</td>
                                    <td>{thamgia.ma_sinh_vien}</td>
                                    <td>{thamgia.ho_va_ten}</td>
                                    <td>{findClassName(thamgia.id_lop)}</td>
                                    <td>{findHoatDongName(thamgia.id_HoatDong_NgoaiKhoa)}</td>
                                    <td>{trangThaiMap[thamgia.trang_thai]}</td>
                                    <td>{findHoatDongDRL(thamgia.id_HoatDong_NgoaiKhoa)}</td>
                                    <td>{moment(thamgia.thoi_gian_dien_ra).format("DD/MM/YYYY")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default HDNKChuaDiemDanh;
