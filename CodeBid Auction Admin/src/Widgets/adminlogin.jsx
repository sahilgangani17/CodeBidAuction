import React, { useState } from "react";
import { db } from "./firebaseconfig";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../Styles/AdminLogin.css"

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const adminRef = doc(db, "AdminDetails", "AdminLoginInfo");
            const adminDoc = await getDoc(adminRef);

            if (adminDoc.exists()) {
                const data = adminDoc.data();
                if (username === data.username && password === data.password) {
                    localStorage.setItem('Admin', username);      
                    navigate("/admin-dashboard");
                } else {
                    setError("Invalid credentials");
                }
            } else {
                setError("Admin not found");
            }
        } catch (error) {
            console.error("Error logging in:", error.message);
            setError("Something went wrong!");
        }
    };

    return (
        <>
            <div className="container">
                <h2>Admin Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="input-wrapper">
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="input-wrapper">
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    
    );
};

export default AdminLogin;
