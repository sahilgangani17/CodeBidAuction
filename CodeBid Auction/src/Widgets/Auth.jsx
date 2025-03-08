  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { auth, db } from "./firebaseconfig";
  import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
  import { collection ,doc, setDoc } from "firebase/firestore";
  import "../styles/Auth.css";

  const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    
    const getusernamelogin = async (uid) => {
      const userdoc = doc(db, 'users', uid);
        try {
          const getdocfield = await getDoc(userdoc);
          if (getdocfield.exists()) {
            return getdocfield.data().username;
          } else {
            console.log("No username data found.");
            return;
          }
        } 
        catch (error) {
          console.error("Error fetching username:", errormessage);
          return;
        }
    }


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
          
          const user = userCredential.user;
          
          const u_name = await getusernamelogin(user.uid);
          // console.log(u_name);
          localStorage.setItem("Username", u_name);
          localStorage.setItem("Uid", user.uid);
          
          console.log("Logged in", user);


        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            username: username,
            email: user.email,
            bidpoints: 1000,
          });
          // const userCollectionRef = collection(db, "LiveAuction");
          await setDoc(doc(db, "LiveAuction", username), {
            uid: user.uid,
            currentBid: 0
          });

          localStorage.setItem("Username", username);
          localStorage.setItem("Uid", user.uid);

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
