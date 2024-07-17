// src/App.js
import React, { useReducer, useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Routes , Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import DangKy from './components/TaiKhoan/DangKy';
import Header from './components/Commons/Header';
// import ThemTroLySinhVien from './components/Home/ThemTroLySinhVien';
import DangNhap from './components/TaiKhoan/DangNhap';
import BanTin from './components/BanTin/BanTin';
import DangXuat from './components/TaiKhoan/DangXuat';
import SinhVienDangKy from './components/TaiKhoan/SinhVien';
import ExportBaoCao from './components/QuanLy/Export';
import ChatScreen from './components/ChatFireBase/ChatScreen';
import DiemDanh from './components/QuanLy/UploadFileDiemDanh';
import CreatePost from './components/QuanLy/TaoBaiViet';
import HoatDong from './components/QuanLy/HoatDong';
// import HoatDongChuaCoBaiViet from './components/QuanLy/DanhSanhHoatDong';
import QuanLyHoatDong from './components/QuanLy/QuanLyCacHoatDong';
import SuaHoatDong from './components/QuanLy/SuaHoatDong';
import ChatListScreen from './components/ChatFireBase/RoomChat';
import ChatDetailScreen from './components/ChatFireBase/Chat';
// import DanhSachBaoThieu from './components/QuanLy/DanhSachBaoThieu';
// import DanhSachSinhVien from './components/QuanLy/DanhSachSinhVien';
// import ChiTietBaoThieu from './components/QuanLy/ChiTietBaoThieu';
// import ThanhTichNgoaiKhoa from './components/QuanLy/ThanhTichNgoaiKhoa';
// import HDNKChuaDiemDanh from './components/SinhVien/HDNKChuaDiemDanh';
import HDNKDiemDanh from './components/SinhVien/HDNKDiemDanh';
// import MinhChung from './components/SinhVien/MinhChung';
import { MyDispatchContext, MyUserContext } from './configs/MyContext';
import UserInfo from './components/TaiKhoan/TaiKhoan';
import MyUserReducer from './reducers/MyUserReducer';
import cookie from "react-cookies";
import NoAccess from './components/NoAccess';

const App = () => {


  const ProtectedRoute = ({ element: Component, allowedRoles, user, ...rest }) => {
    return (
      allowedRoles.includes(user?.role) ? <Component {...rest} /> : <Navigate to="/no-access" />
    );
  };

  const [user, dispatch] = useReducer(MyUserReducer, cookie.load("user") || null);
  return (
    <BrowserRouter>
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <Header />
        <Routes>
          

          
              {/* <Route path="/them-tro-ly-sinh-vien" element={<ThemTroLySinhVien />} />
              <Route path="/hoat-dong-chua-co-bai-viet" element={<HoatDongChuaCoBaiViet />} />
              <Route path="/chat-detail" element={<ChatDetailScreen />} />
              <Route path="/danh-sach-bao-thieu" element={<DanhSachBaoThieu />} />
              <Route path="/danh-sach-sinh-vien" element={<DanhSachSinhVien />} />
              <Route path="/chi-tiet-bao-thieu" element={<ChiTietBaoThieu />} />
              <Route path="/thanh-tich-ngoai-khoa" element={<ThanhTichNgoaiKhoa />} /> */}
       
              <Route path="/dang-nhap" element={<DangNhap />} />
              <Route path="/dang-ky" element={<DangKy />} />
              
              <Route path="/sinh-vien-dang-ky" element={<SinhVienDangKy />} />
              <Route path="/" element={<BanTin />} />
              <Route path="/dang-xuat" element={<DangXuat />} />
              <Route path="/profile" element={<UserInfo />} />
              <Route path="/no-access" element={<NoAccess />} />

              <Route path="/chat" element={<ChatScreen />} />

              <Route path="/chat-list" element={<ProtectedRoute element={ChatListScreen} allowedRoles={[3]} user={user} />} />
              <Route path="/chat-list/:roomId" element={<ProtectedRoute element={ChatDetailScreen} allowedRoles={[3]} user={user} />} />
              <Route path="/export-bao-cao" element={<ProtectedRoute element={ExportBaoCao} allowedRoles={[3]} user={user} />} />


              {/* <Route path="/hdnk-chua-diem-danh" element={<ProtectedRoute element={HDNKChuaDiemDanh} allowedRoles={[3]} user={user}  />} /> */}
              {/* <Route path="/minh-chung" element={<MinhChung />} /> */}


              <Route path="/tao-hoat-dong" element={<ProtectedRoute element={HoatDong} allowedRoles={[3]} user={user} />} />
              <Route path="/diem-danh" element={<ProtectedRoute element={DiemDanh} allowedRoles={[3]} user={user} />} />
              <Route path="/quan-ly-hoat-dong" element={<ProtectedRoute element={QuanLyHoatDong} allowedRoles={[3]} user={user} />} />
              <Route path="/sua-hoat-dong" element={<ProtectedRoute element={SuaHoatDong} allowedRoles={[3]} user={user} />} />
              <Route path="/tao-bai-viet" element={<ProtectedRoute element={CreatePost} allowedRoles={[3]} user={user} />} />
              <Route path="/hdnk-diem-danh" element={<ProtectedRoute element={HDNKDiemDanh} allowedRoles={[4]} user={user} />} />

      
         
        </Routes>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
    </BrowserRouter>

  );
};

export default App;
