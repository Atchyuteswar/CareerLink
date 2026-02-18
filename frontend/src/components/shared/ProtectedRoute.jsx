import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            navigate("/login");
        }
    }, [user, navigate]);

    // If user exists (student or recruiter), render the page
    return (
        <>
            {children}
        </>
    );
};

export default ProtectedRoute;