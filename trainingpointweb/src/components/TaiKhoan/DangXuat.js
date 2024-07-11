import { useContext } from "react";
import { Button } from "react-bootstrap"; // Thay thế react-native-paper bằng react-bootstrap hoặc các thư viện UI khác cho ReactJS
import { MyDispatchContext, MyUserContext } from "../../configs/MyContext";
import cookie from "react-cookies";
import { useNavigate } from "react-router-dom";

const DangXuat = () => {
    // const [user, dispatch, isAuthenticated, setIsAuthenticated, role, setRole] = useContext(MyContext);
    const dispatch = useContext(MyDispatchContext);
    const nav = useNavigate();
    const logout = () => {
        dispatch({
            type: "logout"
        });
        console.log("Đăng xuất thành công!");
        nav("/dang-nhap");
        // // Xử lý localStorage trong ReactJS
        // cookie.save('token', null);
        // // setIsAuthenticated(false);
        // cookie.save('firebase-token', null);
    };

    return (
        <Button variant="outline-danger" onClick={logout} style={{ marginTop: 10 }} className="mx-2">
            Đăng xuất
        </Button>
    );
};

export default DangXuat;
