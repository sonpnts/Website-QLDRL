import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import BaiViet from './BaiViet';
import { isCloseToBottom } from '../Utils/Tobottom';
import APIs, { authAPI, endpoints } from '../../configs/APIs';
import debounce from 'lodash.debounce';

const BanTin = () => {
    const [q, setQ] = useState('');
    const [baiViets, setBaiViets] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const scrollContainerRef = useRef(null);

    const loadBaiViets = useCallback(async () => {
        console.log("Page", page);
        try {
            setLoading(true);
            let baiviets = await authAPI().get(`${endpoints['bai_viet']}?page=${page}`);

            if (baiviets.data.next === null) {
                setPage(0);
            }
            if (page === 1) {
                setBaiViets(baiviets.data.results);
            } else {
                setBaiViets(current => {
                    return [...current, ...baiviets.data.results];
                });
            }

        } catch (ex) {
            console.log("Lỗi", ex);
        } finally {
            setLoading(false);
        }
    }, [page]);

    const handleSearch = useCallback(
        debounce(async (query) => {
            setPage(1);
            try {
                setLoading(true);
                let baiviets = await authAPI().get(`${endpoints['bai_viet']}?q=${query}`);
                console.log(baiviets.data);
                if (baiviets.data.count === 0) {
                    setBaiViets([]);
                } else {
                    setBaiViets(baiviets.data.results);
                }
            } catch (ex) {
                console.log("Lỗi", ex);
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        handleSearch(q);
    }, [q, handleSearch]);

    useEffect(() => {
        loadBaiViets();
    }, [loadBaiViets, page]);

    const loadMore = () => {
        if (!loading && page > 0 && scrollContainerRef.current && isCloseToBottom(scrollContainerRef.current)) {
            setPage(page + 1);
        }
    };

    // const handleRefresh = useCallback(() => {
    //     setRefreshing(true);
    //     setPage(1);
    //     loadBaiViets().then(() => setRefreshing(false));
    // }, [loadBaiViets]);

    const handleTextChange = (event) => {
        setQ(event.target.value);
    };

    return (
        <Container onScroll={loadMore} ref={scrollContainerRef}>
            <Row className="mt-3 mb-3">
                <Col md={{ span: 6, offset: 3 }}>
                    <Form inline className="d-flex">
                        <Form.Control 
                            type="text" 
                            placeholder="Nhập từ khóa..." 
                            onChange={handleTextChange} 
                            value={q} 
                            style={{ marginRight: '10px' }}
                            className="mr-sm-2 flex-grow-1" 
                        />
                        <Button onClick={() => handleSearch(q)} variant="primary">
                            Tìm kiếm
                        </Button>
                    </Form>
                </Col>
            </Row>
            {baiViets.length === 0 ? (
                <Row className="justify-content-center">
                    <Col md="auto">
                        <p>Không có bài viết nào</p>
                    </Col>
                </Row>
            ) : (
                baiViets.map(b => (
                    <Row key={b.id} className="justify-content-center">
                        <Col md={8}>
                            <BaiViet baiviet={b} />
                        </Col>
                    </Row>
                ))
            )}
            {loading && page > 1 && (
                <Row className="justify-content-center">
                    <Col md="auto">
                        <Spinner animation="border" />
                        <span className="ml-2">Đang tải...</span>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default BanTin;
