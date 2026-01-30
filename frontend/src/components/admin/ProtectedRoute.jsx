import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null || user.role !== 'recruiter') {
            navigate("/");
        }
    }, [user, navigate]);

    return <>{children}</>;
};
export default ProtectedRoute;