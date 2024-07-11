import React, { useState, useEffect, useCallback , useRef } from 'react';
import BaiViet from './BaiViet';
import { isCloseToBottom } from '../Utils/Tobottom';
import APIs, { authAPI, endpoints } from '../../configs/APIs';


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

            if(baiviets.data.next === null)
            {
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

    const handleSearch = async () => {
        setPage(1);
        try {
            setLoading(true);
            let baiviets = await APIs.get(`${endpoints['bai_viet']}?q=${q}`);
            if(baiviets.data.count === 0)
            {
                // setPage(1);
                loadBaiViets();
            }
            else{
                setBaiViets(baiviets.data.results);
            }

        } catch (ex) {
            console.log("Lỗi", ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBaiViets();
    }, [loadBaiViets, page]);

    const loadMore = () => {
        if (!loading && page > 0 && scrollContainerRef.current && isCloseToBottom(scrollContainerRef.current)) {
            setPage(page + 1);
        }
    };


    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(1);
        loadBaiViets().then(() => setRefreshing(false));
    }, [loadBaiViets]);

    const handleTextChange = (event) => {
        setQ(event.target.value);
        if (event.target.value === '') {
            setPage(1);
        }
    };

    return (
        <div onScroll={loadMore}>
            <div style={{ margin: 10 }}>
                <input type="text" placeholder="Nhập từ khóa..." onChange={handleTextChange} value={q} />
                <button onClick={handleSearch}>Tìm kiếm</button>
            </div>
            {baiViets.length === 0 ? <p>Hello</p> :
                <>
                    {baiViets.map(b => (
                        <BaiViet
                            key={b.id}
                            baiviet={b}
                        />
                    ))}
                </>
            }
            {loading && page > 1 && <p>Đang tải...</p>}
        </div>
    );
};

export default BanTin;
