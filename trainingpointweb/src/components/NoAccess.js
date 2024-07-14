import React from 'react';
import { Link } from 'react-router-dom';

const NoAccess = () => {
  return (
    <div className="no-access-container d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-1">403</h1>
        <h2 className="mb-4">Không có quyền truy cập</h2>
        <p className="mb-4">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ với quản trị viên nếu bạn nghĩ đây là một lỗi.
        </p>
        <Link to="/" className="btn btn-primary">
          Về trang chủ
        </Link>
      </div>
      <style>
        {`
          .no-access-container {
            background-color: #f8f9fa;
            animation: fadeIn 1s ease-in-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          h1.display-1 {
            font-size: 6rem;
            font-weight: 700;
            color: #dc3545;
            animation: bounce 2s infinite;
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-30px);
            }
            60% {
              transform: translateY(-15px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default NoAccess;
