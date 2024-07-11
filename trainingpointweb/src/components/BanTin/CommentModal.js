import React, { useState, useEffect , useContext} from 'react';
import { Modal, Button, Form,  Spinner} from 'react-bootstrap';
import moment from 'moment';
import { isCloseToBottom } from '../Utils/Tobottom';
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import { MyUserContext } from '../../configs/MyContext';
const CommentModal = ({ visible, onClose, postId }) => {
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
            // Alert.alert('Bình luận thành công!');
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
        <Modal show={visible} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Comments</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <Form.Control
                        as="textarea"
                        placeholder="Enter your comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                    />
                </div>
                <Button variant="primary" onClick={handlePostComment} disabled={!comment || loading || !user}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Post Comment'}
                </Button>
                <hr />
                <div className="comments-list">
                    {comments.map((c, index) => (
                        <div key={index} className="comment">
                            <p><strong>{c.author}</strong></p>
                            <p className="text-muted">{moment(c.created_date).format('HH:mm - DD/MM/YYYY')}</p>
                            <p>{c.content}</p>
                        </div>
                    ))}
                    {loading && page > 1 && <Spinner animation="border" />}
                    {!loading && comments.length === 0 && <p>No comments found.</p>}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CommentModal;
