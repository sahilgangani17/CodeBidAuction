import React ,{ userState, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => (e) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        setError("");

        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in ", userCredential.user);
            navigate("/Auction");
        }
        catch(err){
            setError("Invalid email or password.");
        }
    };

    return (
        <>
            <div className="auth-container">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                </form>

            </div>
        
        
        </>

    );

}