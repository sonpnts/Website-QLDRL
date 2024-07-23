import React from 'react';
import { useParams } from 'react-router-dom';
import './ThongTin1.css'; 

const notifications = [
    {
        id: 1,
        title: "Làm thế nào để chọn đúng ngành khi không biết mình thích gì",
        date: "09/01/2015 10:20",
        content: "Em trước giờ không biết mình thích gì và đang băn khoăn chọn trường thi đại học. Em dự định chọn ngành Quản trị khách sạn vì thấy khá phù hợp với tính cách năng động, hòa đồng, giao tiếp tốt của mình. Nhưng em không có người quen, gia đình không điều kiện, tiếng Anh kém nên khá lo lắng. Bố mẹ thì không muốn em học ngành này mà khuyên em vào Sư phạm. Đây là ngành em ghét nhất, nhưng có vẻ lại có năng khiếu khi hay giảng bài cho các bạn trong lớp và ai cũng khen dễ hiểu, giúp các bạn học tốt hơn. Em không biết một người thích đi đây đi đó, thích du học, trải nghiệm và đam mê mỹ phẩm như em nếu bị bó hẹp trong khuôn khổ đồ công sở, tác phong mẫu mực cùng những chuẩn mực của nghề giáo liệu rằng có phù hợp? Em mong mọi người cho em lời khuyên. Em cảm ơn nhiều.",
        author: "Nguyễn Thị Hương Giang",
    }
];

const ThongTin1 = () => {
    const { id } = useParams();
    const notification = notifications.find(n => n.id === parseInt(id));

    if (!notification) {
        return <p>Thông báo không tìm thấy.</p>;
    }

    // Tìm các tin cùng chuyên mục (trừ tin hiện tại)
    const relatedNotifications = notifications.filter(n => n.id !== notification.id);

    return (
        <div className="notification-detail">
            <h1>{notification.title}</h1>
            <p><strong>Ngày:</strong> {notification.date}</p>
            <p>{notification.content}</p>
            <p><strong>Người gửi:</strong> {notification.author}</p>

            {relatedNotifications.length > 0 && (
                <div className="related-notifications">
                    <h2>Tin cùng chuyên mục</h2>
                    <ul>
                        {relatedNotifications.map((n) => (
                            <li key={n.id}>
                                <a href={`/thong-tin/${n.id}`}>
                                    {n.title} (Ngày: {n.date})
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ThongTin1;
