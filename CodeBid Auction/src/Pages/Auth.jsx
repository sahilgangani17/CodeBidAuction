import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebaseconfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "../styles/Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in", userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          username: username,
          email: user.email,
          bidpoints: 1000,
        });

        console.log("Signed up:", user);
      }
      navigate("/Auction"); // Redirect after successful login/signup
    } catch (err) {
      setError(err.message);
    }
  };

  // Dynamic input creation function accepting type, placeholder, value and onChange callback
  const createInput = (type, placeholder, value, onChange) => {
    return (
      <div className="input-wrapper">
        <input
          type={type}
          placeholder={`Enter ${placeholder}`}
          value={value}
          onChange={onChange}
          required
        />
      </div>
    );
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAuth}>
        {!isLogin && createInput("text", "Username", username, (e) => setUsername(e.target.value))}
        {createInput("email", "Email", email, (e) => setEmail(e.target.value))}
        {createInput("password", "Password", password, (e) => setPassword(e.target.value))}
        <button type="submit">{isLogin ? "Login" : "Signup"}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span onClick={() => setIsLogin(!isLogin)} className="link">
          {isLogin ? "Signup" : "Login"}
        </span>
      </p>
    </div>
  );
};

export default Auth;
