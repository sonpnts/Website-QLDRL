import React, { useState, useEffect, useContext } from 'react';
import { Alert, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../configs/Firebase';
import {MyDispatchContext, MyUserContext} from '../../configs/MyContext';
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import { useNavigate } from 'react-router-dom';

const ChatListScreen = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [khoa, setKhoa] = useState('');
//   const [user, dispatch, isAuthenticated, setIsAuthenticated, role, setRole] = useContext(MyContext);
  const navigate = useNavigate();
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
  const getroom = async (id) => {
    const unsubscribe = onSnapshot(collection(db, 'chatRooms'), (snapshot) => {
      let rooms = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (user.role === 3 && data.khoa === id) {
          rooms.push({ ...data, id: doc.id });
        } 
      });
      setChatRooms(rooms);
    });
    return () => unsubscribe();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authAPI().get(endpoints['get_khoa']);
        if (response.status === 200) {
          setKhoa(response.data);
          getroom(response.data.id);
        } else {
          Alert.alert('Error', 'Lỗi khi lấy khoa');
        }
      } catch (error) {
        console.error('Lỗi khi lấy khoa:', error);
        Alert.alert('Error', 'Lỗi khi lấy khoa');
      }
    };

    fetchData(); 
  }, [user.role, navigate]);

  return (
    <Container>
      <Row>
        {chatRooms.map(room => (
          <Col key={room.id} md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>MSSV: {room.mssv}</Card.Title>
                <Card.Text>Tên sinh viên: {room.ten_sv}</Card.Text>
                <Button variant="primary" onClick={() => navigate(`/chat-list/${room.id}`)}>View Chat</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ChatListScreen;
