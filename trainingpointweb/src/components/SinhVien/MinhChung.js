// import React, { useState, useEffect } from 'react';
// import { View, ScrollView, Text, TextInput, Button, Alert, Image, TouchableOpacity } from 'react'; 
// import APIs, { endpoints } from '../../configs/APIs';


// const MinhChung = ({ navigation }) => {
//     const [loading, setLoading] = useState(true);
//     const [success, setSuccess] = useState(false);
//     const [hoatDongs, setHoatDongs] = useState([]);
//     const [thamGia, setThamGia] = useState(null);
//     const [minhchung, setMinhChung] = useState({
//         description: "",
//         anh_minh_chung: "",
//         tham_gia: "",
//         phan_hoi: ""
//     });

//     const [isImageEnlarged, setIsImageEnlarged] = useState(false);

//     const route = navigation.getParam('route', {});
//     const { thamgia_id } = route.params;

//     const trangThaiMap = {
//         0: 'Đăng Ký',
//         1: 'Điểm Danh',
//         2: 'Báo Thiếu',
//         3: 'Báo Thiếu Bị Từ Chối',
//     };

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 // Các lệnh gọi API sẽ giống như trước, chỉ cần loại bỏ phần không sử dụng cho React web
//                 const reshd = await APIs.get(endpoints['hoatdong']);
//                 setHoatDongs(reshd.data);

//                 const restg = await APIs.get(`/thamgias/${thamgia_id}`);
//                 setThamGia(restg.data);

//                 if (restg.data.trang_thai === 2 || restg.data.trang_thai === 3) {
//                     const resmc = await APIs.get(`/thamgias/${thamgia_id}/minhchungs/`);
//                     if (resmc.data.length > 0) {
//                         const minhChungData = resmc.data[0];
//                         setMinhChung({
//                             description: minhChungData.description,
//                             anh_minh_chung: minhChungData.anh_minh_chung,
//                             tham_gia: thamgia_id,
//                             phan_hoi: minhChungData.phan_hoi,
//                         });
//                     }
//                 }

//                 setLoading(false);
//             } catch (error) {
//                 console.error("Lỗi khi lấy thông tin người dùng:", error);
//                 setLoading(false);
//             }
//         };

//         fetchUserData();
//     }, [thamgia_id]);

//     useEffect(() => {
//         if (route.params && route.params.success) {
//             setSuccess(route.params.success);
//         }
//     }, [route.params]);

//     useEffect(() => {
//         const postAndResetSuccess = async () => {
//             try {
//                 await PostMinhChung();
//                 setSuccess(false);
//             } catch (error) {
//                 console.error('Error in postAndResetSuccess:', error);
//             }
//         };
//         if (success) {
//             postAndResetSuccess();
//         }
//     }, [success]);

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

//     const handleDescriptionChange = (text) => {
//         setMinhChung(current => ({ ...current, description: text }));
//     };

//     // Loại bỏ hàm handleChooseImg vì không sử dụng expo-image-picker
//     // Loại bỏ các hàm PostMinhChung, PatchMinhChung, updateTrangThai và handleSubmit để tinh gọn cho bài ví dụ

//     if (loading) {
//         return (
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                 {/* Sử dụng React web cho Indicator */}
//                 <Text>Loading...</Text>
//             </View>
//         );
//     }

//     const hoatdongInfo = findHoatDongInfo(thamGia.hd_ngoaikhoa);

//     // Điều chỉnh các phần hiển thị UI cho phù hợp với React web

//     return (
//         <ScrollView style={styles.container}>
//             {/* Phần hiển thị thông tin hoạt động ngoại khóa và biểu mẫu nhập dữ liệu */}
//         </ScrollView>
//     );
// };

// const styles = {
//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: '#fff',
//     },
//     infoContainer: {
//         marginBottom: 16,
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     value: {
//         fontSize: 16,
//     },
//     input: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         paddingLeft: 8,
//         marginTop: 8,
//     },
//     button: {
//         marginTop: 16,
//     },
//     imageContainer: {
//         margin: 10,
//         alignItems: 'center',
//     },
//     image: {
//         width: 200,
//         height: 200,
//         resizeMode: 'contain',
//     },
//     enlargedImage: {
//         width: 400,
//         height: 400,
//     },
// };

// export default MinhChung;
