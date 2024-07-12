import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Image } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import moment from 'moment';
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import { MyDispatchContext, MyUserContext } from '../../configs/MyContext';
import CommentModal from './CommentModal';

const BaiViet = ({ baiviet = null }) => {
    const [expanded, setExpanded] = useState(false);
    const [hoatdong, setHoatDong] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [baiViet, setBaiViet] = useState(null);
    const [author, setAuthor] = useState(null);
    const [liked, setLiked] = useState(null);
    const [registered, setRegistered] = useState(false);
    const maxDisplayWords = 20;
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const [loading, setLoaing] = useState(false);
    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const handleModalVisible = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const getAuthor = async (id) => {
        try {
            let auth = await APIs.get(endpoints['tac_gia'](id));
            setAuthor(auth.data);
        } catch (error) {
            console.error("Lỗi khi lấy tác giả:", error);
        }
    };

    const checkLiked = async (id) => {
        try {
            const response = await authAPI().get(endpoints['baiviet_liked'](id));
            setLiked(response.data.liked);
        } catch (error) {
            console.error("Lỗi khi kiểm tra trạng thái 'liked':", error);
        }
    };

    const handleLike = async (id) => {
        try {
            const response = await authAPI().post(endpoints['baiviet_like'](id), null);
            setLiked(!liked); // Đảo ngược trạng thái liked
        } catch (error) {
            console.error("Lỗi khi xử lý like:", error);
        }
    };

    const checkRegister = async (id) => {
        try {
            const response = await authAPI().get(endpoints['kiem_tra_dang_ky'](id));
            setRegistered(response.data.registered);
        } catch (error) {
            console.error("Lỗi khi kiểm tra trạng thái đăng ký hoạt động:", error);
        }
    };

    const handleRegistration = async (id) => {
        try {
            setLoaing(true);
            const response = await authAPI().post(endpoints['dang_ky_hoat_dong'](id), null);
            if (response.status === 201) {
                setRegistered(true);
            }
        } catch (error) {
            console.error("Lỗi khi xử lý đăng ký:", error);
        }
        setLoaing(false);
    };

    const getHoatDong = async (id) => {
        try {
            let response = await APIs.get(endpoints['hoat_dong'](id));
            setHoatDong(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy hoạt động:", error);
        }
    };

    useEffect(() => {
        if (baiviet) {
            setBaiViet(baiviet);
            getHoatDong(baiviet.hd_ngoaikhoa);
            // console.log(user);
            if(user){
                getAuthor(baiviet.id);
                checkLiked(baiviet.id);
                if (user.role === 4) {
                    checkRegister(baiviet.hd_ngoaikhoa);
                }
            }
            
        }
    }, [baiviet]);

    const formatISODate = (isoDateString, format = "HH:mm - DD/MM/YYYY") => {
        return moment(isoDateString).format(format);
    };

    return (
        <div className="container">
            {baiViet === null ? <></> : (
                <>
                    <Card style={{ width: '50%',marginBottom: '20px', borderRadius:'10px' }}>
                    
                    <Card.Body>
                        <Card.Title >{baiViet.title}</Card.Title>
                        <Card.Text>
                        {baiViet.content}
                        <br />
                        Ngày tổ chức: {hoatdong ? formatISODate(hoatdong.ngay_to_chuc) : 'Loading...'}
                        <br />
                        Điểm rèn luyện: {hoatdong ? hoatdong.diem_ren_luyen : 'Loading...'}
                        <br />
                        Điều: {hoatdong ? hoatdong.dieu : 'Loading...'}
                        </Card.Text>
                        <Card.Img variant="top" src={baiViet.image} style={{  objectFit: 'cover', marginBottom:'20px', width:'60%', display: 'block',  marginLeft: 'auto',  marginRight: 'auto'  }} />
                        <div className="d-flex justify-content-center">
                            <Button className="mx-2" variant={liked ? 'primary' : 'outline-primary'} onClick={() => handleLike(baiViet.id)} disabled={!user} >
                                {liked ? 'Đã Thích' : 'Thích'}
                            </Button>
                            <Button className="mx-2" onClick={handleModalVisible} variant="outline-secondary" >
                                Bình luận
                            </Button>
                            {registered ? (
                                <Button className="mx-2" variant="outline-secondary" disabled>
                                    Đã Đăng Ký
                                </Button>
                            ) : (
                                <Button 
                                className="mx-2" 
                                onClick={() => handleRegistration(baiViet.hd_ngoaikhoa)} 
                                variant="outline-dark" 
                                disabled={!user || user.role !== 4 || loading} // Disable khi loading
                            >
                                {loading ? 'Đang đăng ký...' : 'Đăng ký'} {/* Thay đổi text khi loading */}
                            </Button>
                            )}
                        </div>
                        
                    </Card.Body>
                    
                </Card>
                
                <CommentModal visible={modalVisible} onClose={handleCloseModal} postId={baiViet.id} />
                </>
                
            )}
            
        </div>
    );
};

export default BaiViet;
