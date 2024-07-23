// import React, { useState, useEffect, useContext } from 'react';
// import { Button, Form, Alert, Spinner } from 'react-bootstrap';
// import { useLocation, useNavigate } from 'react-router-dom';
// import APIs, { authAPI, endpoints, formatDate } from '../../configs/APIs';
// import { MyUserContext } from '../../configs/MyContext';
// import Footer1 from './Footer1';
// import './Styles.css';


// const CreatePost = () => {
//   const location = useLocation();
//   const hoatDongId = location.state?.hoatDongId;
//   const navigate = useNavigate();
//   const user = useContext(MyUserContext);

//   const [post, setPost] = useState({
//     title: '',
//     image: '',
//     tro_ly: user.id,
//     hd_ngoaikhoa: hoatDongId,
//     content: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [activityInfo, setActivityInfo] = useState();

//   useEffect(() => {
//     fetchActivityInfo(hoatDongId);
//   }, [hoatDongId]);

//   const fetchActivityInfo = async () => {
//     try {
//       const response = await authAPI().get(`${endpoints['hd']}${hoatDongId}/`);
//       setActivityInfo(response.data);
//       // console.log(response.data);
//     } catch (error) {
//       console.error('Error fetching activity:', error);
//       window.alert('Error: Failed to fetch activity'); // Use window.alert instead
//     }
//   };

//   const handleChange = (field, value) => {
//     setPost((current) => ({ ...current, [field]: value }));
//   };

//   const handleChooseImage = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//           handleChange('image', {
//               file, // Lưu trữ file trong state
//               preview: reader.result // Lưu trữ URL dữ liệu của file để hiển thị bản xem trước
//           });
//       };
//       reader.readAsDataURL(file); // Đọc file dưới dạng URL dữ liệu
//   }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       let form = new FormData();
//       for (let key in post) {
//         if (key === "image") {
//           form.append(key, post.image.file, post.image.file.name); // Thêm file vào FormData
//         } else {
//             form.append(key, post[key]); // Thêm các field khác vào FormData
//         }
//       }

//       const response = await authAPI().post(endpoints['bai_viet'], form, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       if (response.status === 201) {
//         window.alert('Success: Post created successfully!'); // Use window.alert instead
//         navigate(-1);
//       }
//     } catch (error) {
//       console.error('Error creating post:', error);
//       window.alert('Error: Failed to create post'); // Use window.alert instead
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//     <div style={{ padding: '20px' }}>
//       <h2 className="mb-4 custom-title">Tạo bài viết</h2>
//       {activityInfo ? (
//         <div style={{ marginBottom: '20px', marginTop:'20px' }}>
//           <p><strong>Tên hoạt động:</strong> {activityInfo.ten_HD_NgoaiKhoa}</p>
//           <p><strong>Điều:</strong> {activityInfo.dieu}</p>
//           <p><strong>Điểm:</strong> {activityInfo.diem_ren_luyen}</p>
//           <p><strong>Ngày tổ chức:</strong> {formatDate(activityInfo.ngay_to_chuc)}</p>
//           <p><strong>Thông tin hoạt động:</strong> {activityInfo.thong_tin}</p>
//         </div>
//       ) : (
//         <Spinner animation="border" />
//       )}

//       <Form style={{ marginBottom: '20px' }}>
//         <Form.Group controlId="formTitle">
//           <Form.Label>Tiêu đề:</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Nhập vào tiêu đề bài viết"
//             value={post.title}
//             onChange={(e) => handleChange('title', e.target.value)}
//             style={{ marginBottom: '15px' }}
//           />
//         </Form.Group>

//         <Form.Group controlId="formImage">
//           <Form.Label>Hình ảnh: </Form.Label>
//           <input type="file" onChange={handleChooseImage} />
//           {post.image && (
//             <img
//               src={URL.createObjectURL(post.image.file)}
//               alt="Post"
//               style={{ width: '100%', height: 'auto', marginTop: '10px' }}
//             />
//           )}
//         </Form.Group>

//         <Form.Group controlId="formContent">
//           <Form.Label>Nội dung bài viết:</Form.Label>
//           <Form.Control
//             as="textarea"
//             rows={4}
//             placeholder="Nhập vào nội dung bài viết"
//             value={post.content}
//             onChange={(e) => handleChange('content', e.target.value)}
//             style={{ marginBottom: '15px' }}
//           />
//         </Form.Group>

//         {loading ? (
//           <Spinner animation="border" />
//         ) : (
//           <Button variant="primary" onClick={handleSubmit}>
//             Đăng bài viết
//           </Button>
//         )}
//       </Form>
//     </div>
//     <Footer1/>
//     </div>

//   );
// };

// export default CreatePost;


import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Alert, Spinner, Container, Row, Col, Card, Image } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import APIs, { authAPI, endpoints, formatDate } from '../../configs/APIs';
import { MyUserContext } from '../../configs/MyContext';
import Footer1 from './Footer1';
import './Styles.css';

const CreatePost = () => {
  const location = useLocation();
  const hoatDongId = location.state?.hoatDongId;
  const navigate = useNavigate();
  const user = useContext(MyUserContext);

  const [post, setPost] = useState({
    title: '',
    image: '',
    tro_ly: user.id,
    hd_ngoaikhoa: hoatDongId,
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [activityInfo, setActivityInfo] = useState();
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActivityInfo(hoatDongId);
  }, [hoatDongId]);

  const fetchActivityInfo = async () => {
    try {
      const response = await authAPI().get(`${endpoints['hd']}${hoatDongId}/`);
      setActivityInfo(response.data);
    } catch (error) {
      console.error('Error fetching activity:', error);
      setError('Lỗi khi lấy thông tin hoạt động');
    }
  };

  const handleChange = (field, value) => {
    setPost((current) => ({ ...current, [field]: value }));
  };

  const handleChooseImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('image', {
          file,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let form = new FormData();
      for (let key in post) {
        if (key === 'image') {
          form.append(key, post.image.file, post.image.file.name);
        } else {
          form.append(key, post[key]);
        }
      }

      const response = await authAPI().post(endpoints['bai_viet'], form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        window.alert('Bài viết đã được tạo thành công!');
        navigate(-1);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Lỗi khi tạo bài viết');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <Container className="my-4">
      <h2 className="text-center mb-4 custom-title">Tạo bài viết</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {activityInfo ? (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title className="mb-3" style={{ fontSize: '24px' }}>{activityInfo.ten_HD_NgoaiKhoa}</Card.Title>
            <Card.Text><strong>Điều:</strong> {activityInfo.dieu}</Card.Text>
            <Card.Text><strong>Điểm:</strong> {activityInfo.diem_ren_luyen}</Card.Text>
            <Card.Text><strong>Ngày tổ chức:</strong> {formatDate(activityInfo.ngay_to_chuc)}</Card.Text>
            <Card.Text><strong>Thông tin hoạt động:</strong> {activityInfo.thong_tin}</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      )}

      <Form>
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label><strong>Tiêu đề:</strong></Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập vào tiêu đề bài viết"
            value={post.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formImage" className="mb-3">
          <Form.Label><strong>Hình ảnh:</strong></Form.Label>
          <Form.Control type="file" onChange={handleChooseImage} />
          {post.image && (
            <Image
              src={post.image.preview}
              alt="Post"
              fluid
              className="mt-3"
            />
          )}
        </Form.Group>

        <Form.Group controlId="formContent" className="mb-3">
          <Form.Label><strong>Nội dung bài viết:</strong></Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Nhập vào nội dung bài viết"
            value={post.content}
            onChange={(e) => handleChange('content', e.target.value)}
          />
        </Form.Group>

        <div className="d-grid">
          {loading ? (
            <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{' '}
              Đang xử lý...
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              Đăng bài viết
            </Button>
          )}
        </div>
      </Form>
    </Container>
        <Footer1/>
    </div>
  );
};

export default CreatePost;
