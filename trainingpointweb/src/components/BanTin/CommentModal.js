import React, { useState, useEffect, useContext } from 'react';
import { Container, Modal, Button, Form, Spinner, Row, Col, Card } from 'react-bootstrap';
import moment from 'moment';
import { isCloseToBottom } from '../Utils/Tobottom';
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import { MyUserContext } from '../../configs/MyContext';

const CommentModal = ({ visible, onClose, postId, baiviet, hoatDong }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isInputFocused, setInputFocused] = useState(false);
    const [page, setPage] = useState(1);
    const user = useContext(MyUserContext);

    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId, page]);

    const getAuthor = async (id) => {
        try {
            const response = await authAPI().get(endpoints['owner_binh_luan'](id));
            return response.data;
        } catch (error) {
            console.error('Error fetching author:', error);
            return null;
        }
    };

    const fetchComments = async () => {
        if (page > 0) {
            try {
                setLoading(true);
                const response = await authAPI().get(endpoints['lay_binh_luan'](postId, page));
                const fetchedComments = response.data.results;
                const updatedComments = await Promise.all(fetchedComments.map(async (c) => {
                    const author = await getAuthor(c.id);
                    return { ...c, author: author ? author.username : "Unknown" };
                }));
                updatedComments.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
                if (response.data.next === null) {
                    setPage(0);
                }

                if (page === 1) {
                    setComments(updatedComments);
                } else {
                    setComments(current => [...current, ...updatedComments]);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePostComment = async () => {
        try {
            await authAPI().post(endpoints['binh_luan'](postId), { content: comment });
            setComment('');
            setPage(1);
            setComments([]);
            fetchComments();
            setInputFocused(false);
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const loadMore = ({ target }) => {
        if (!loading && page > 0 && isCloseToBottom(target)) {
            setPage(page + 1);
        }
    };

    const formatISODate = (isoDateString, format = "HH:mm - DD/MM/YYYY") => {
        return moment(isoDateString).format(format);
    };

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape" && visible) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [visible, onClose]);

    return (
        <Modal show={visible} onHide={onClose} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Bình luận</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <Col xs={12} md={7}>
                            <Card className="mb-4 shadow-sm">
                                <Card.Body>
                                    <Card.Title className="text-center mb-3">{baiviet.title}</Card.Title>
                                    <Card.Text>
                                        {baiviet.content}
                                        <br />
                                        <strong>Ngày tổ chức:</strong> {hoatDong.ngay_to_chuc ? formatISODate(hoatDong.ngay_to_chuc) : <Spinner animation="border" size="sm" />}
                                        <br />
                                        <strong>Điểm rèn luyện:</strong> {hoatDong.diem_ren_luyen ? hoatDong.diem_ren_luyen : <Spinner animation="border" size="sm" />}
                                        <br />
                                        <strong>Điều:</strong> {hoatDong.dieu ? hoatDong.dieu : <Spinner animation="border" size="sm" />}
                                    </Card.Text>
                                    <Card.Img variant="top" src={baiviet.image} className="mb-3 mx-auto d-block" style={{ maxHeight: '400px', objectFit: 'cover' }} />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={5}>
                            <div className="comments-list" onScroll={loadMore} style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                {comments.map((c, index) => (
                                    <Card key={index} className="comment mb-3 p-3 border rounded shadow-sm">
                                        <Row>
                                            <Col>
                                                <p><strong>{c.author}</strong></p>
                                                <p className="text-muted">{moment(c.created_date).format('HH:mm - DD/MM/YYYY')}</p>
                                                <p>{c.content}</p>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                                {loading && page > 1 && (
                                    <div className="text-center">
                                        <Spinner animation="border" />
                                        <p className="mt-2">Đang tải bình luận...</p>
                                    </div>
                                )}
                                {!loading && comments.length === 0 && <p className="text-center">Không tìm thấy bình luận nào.</p>}
                            </div>
                        </Col>
                    </Row>
                    <hr />
                    <Row className="mb-3">
                        <Col xs={12} md={8} className="mb-2">
                            <Form.Control
                                as="textarea"
                                placeholder="Nhập bình luận của bạn..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                rows={3}
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <Button
                                variant="primary"
                                onClick={handlePostComment}
                                disabled={!comment || loading || !user}
                                className="w-100"
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : 'Post Commment'}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default CommentModal; 
