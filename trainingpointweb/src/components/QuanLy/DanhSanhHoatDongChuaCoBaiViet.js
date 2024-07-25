// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Spinner, Table, Form, Button, Card } from 'react-bootstrap';
// import APIs, { authAPI, endpoints, formatDate } from '../../configs/APIs';
// import { useNavigate } from 'react-router-dom';

// const HoatDongChuaCoBaiViet = () => {
//   const [loading, setLoading] = useState(true);
//   const [activities, setActivities] = useState([]);
//   const [selectedHocKy, setSelectedHocKy] = useState('');
//   const [hocKyList, setHocKyList] = useState([]);
//   const navigate = useNavigate();

//   const fetchHocKy = async () => {
//     try {
//       const response = await APIs.get(endpoints['hocky']);
//       setHocKyList(response.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching hoc ky data:', err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHocKy();
//   }, []);

//   useEffect(() => {
//     if (selectedHocKy) {
//       fetchActivitiesWithoutPost(selectedHocKy);
//     }
//   }, [selectedHocKy]);

//   const fetchActivitiesWithoutPost = async (hoc_ky) => {
//     setLoading(true);
//     try {
//       const response = await authAPI().get(`${endpoints['hoat_dong_tao_bai_viet']}?hoc_ky=${hoc_ky}`);
//       setActivities(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Lỗi khi lấy hoạt động:', error);
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//         <Spinner animation="border" />
//       </Container>
//     );
//   }

//   return (
//     <Container>
//       <Form.Group className="my-3">
//         <Form.Label>Chọn học kỳ</Form.Label>
//         <Form.Control
//           as="select"
//           value={selectedHocKy}
//           onChange={(e) => setSelectedHocKy(e.target.value)}
//         >
//           <option value="">Chọn học kỳ</option>
//           {hocKyList.map((hocKyItem, index) => (
//             <option key={index} value={hocKyItem.id}>
//               Học kỳ {hocKyItem.hoc_ky} - {hocKyItem.nam_hoc}
//             </option>
//           ))}
//         </Form.Control>
//       </Form.Group>
      
//       {activities.length === 0 ? (
//         <p>Không có hoạt động nào.</p>
//       ) : (
//         <Row>
//           {activities.map((activity) => (
//             <Col key={activity.id} md={6} lg={4}>
//               <Card className="mb-3">
//                 <Card.Body>
//                   <Card.Title>{activity.ten_HD_NgoaiKhoa}</Card.Title>
//                   <Card.Text>
//                     Ngày tổ chức: {formatDate(activity.ngay_to_chuc)}
//                   </Card.Text>
//                   <Card.Text>
//                     Thông tin: {activity.thong_tin}
//                   </Card.Text>
//                   <Card.Text>
//                     Điểm rèn luyện: {activity.diem_ren_luyen}
//                   </Card.Text>
//                   <Card.Text>
//                     Điều: {activity.dieu}
//                   </Card.Text>
//                   <Button
//                     variant="primary"
//                     onClick={() => navigate("/tao-bai-viet", { state: { hoatDongId: activity.id } })}
//                   >
//                     Tạo bài viết
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       )}
//     </Container>
//   );
// };

// export default HoatDongChuaCoBaiViet;


import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Form, Button, Card, Alert } from 'react-bootstrap';
import APIs, { authAPI, endpoints, formatDate } from '../../configs/APIs';
import { useNavigate } from 'react-router-dom';
import Footer1 from './Footer1';

const HoatDongChuaCoBaiViet = () => {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [selectedHocKy, setSelectedHocKy] = useState('');
  const [hocKyList, setHocKyList] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchHocKy = async () => {
    try {
      const response = await APIs.get(endpoints['hocky']);
      setHocKyList(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching hoc ky data:', err);
      setError('Không thể tải dữ liệu học kỳ');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHocKy();
  }, []);

  useEffect(() => {
    if (selectedHocKy) {
      fetchActivitiesWithoutPost(selectedHocKy);
    }
  }, [selectedHocKy]);

  const fetchActivitiesWithoutPost = async (hoc_ky) => {
    setLoading(true);
    try {
      const response = await authAPI().get(`${endpoints['hoat_dong_tao_bai_viet']}?hoc_ky=${hoc_ky}`);
      setActivities(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy hoạt động:', error);
      setError('Không thể tải dữ liệu hoạt động');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <div >
      <div fluid className="registration-background">
    <Container className="my-4">
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      <Form.Group className="my-3">
        <Form.Label className="fw-bold" style={{ fontSize: '24px' }}>Chọn học kỳ</Form.Label>
        <Form.Control
          as="select"
          value={selectedHocKy}
          onChange={(e) => setSelectedHocKy(e.target.value)}
        >
          <option value="">Chọn học kỳ</option>
          {hocKyList.map((hocKyItem, index) => (
            <option key={index} value={hocKyItem.id}>
              Học kỳ {hocKyItem.hoc_ky} - {hocKyItem.nam_hoc}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {activities.length === 0 ? (
        <Alert variant="info">Không có hoạt động nào.</Alert>
      ) : (
        <Row>
          {activities.map((activity) => (
            <Col key={activity.id} md={6} lg={4}>
              <Card className="mb-3 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-primary">{activity.ten_HD_NgoaiKhoa}</Card.Title>
                  <Card.Text>
                    <strong>Ngày tổ chức:</strong> {formatDate(activity.ngay_to_chuc)}
                  </Card.Text>
                  <Card.Text>
                    <strong>Thông tin:</strong> {activity.thong_tin}
                  </Card.Text>
                  <Card.Text>
                    <strong>Điểm rèn luyện:</strong> {activity.diem_ren_luyen}
                  </Card.Text>
                  <Card.Text>
                    <strong>Điều:</strong> {activity.dieu}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/tao-bai-viet", { state: { hoatDongId: activity.id } })}
                  >
                    Tạo bài viết
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
    </div>
    <Footer1/>
    </div>
  );
};

export default HoatDongChuaCoBaiViet;
