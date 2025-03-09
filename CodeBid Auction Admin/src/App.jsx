import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import AdminLogin from "./Widgets/adminlogin";
import AdminDashboard from "./Widgets/admindashboard";

const ProtectedRoute = ({ element }) => {
    const isAuthenticated = localStorage.getItem('Admin') ? true : false;
    return isAuthenticated ? element : <Navigate to="/admin-login" />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
                <Route path="*" element={<Navigate to="/admin-login" />} />
            </Routes>
        </Router>
    );
};

export default App;
