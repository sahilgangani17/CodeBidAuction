import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebaseconfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "../styles/Auth.css";

const Auth = () => {
  const [userexist, setUserExist] = useState(true);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const TotalBidPoints = 1000;
  const navigate = useNavigate();

  const checkIfUserExists = async (username) => {
    try {
      if (!username) return false; 
      const userDoc = doc(db, "users", username);
      const docSnapshot = await getDoc(userDoc);
      return docSnapshot.exists();
    } catch (error) {
      console.error("Error checking user existence:", error.message);
      return false;
    }
  };

  const getUserdata = async (username) => {
    try {
      const userDoc = doc(db, "users", username);
      const docSnapshot = await getDoc(userDoc);
      return docSnapshot.data();
    } catch (error) {
      console.error("Error checking user existence:", error.message);
    }
  }


  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    const exists = await checkIfUserExists(username);
    setUserExist(exists);

    try {
      if (!exists) {
        await setDoc(doc(db, "users", username), {
          Username: username,
          TotalBidPoints: TotalBidPoints,
          problemsetNo: [],
        });

        await setDoc(doc(db, 'LiveAuction', username),{
          currentBid: 0
        })
      }

      const userdata = await getUserdata(username);
      console.log(userdata);
      localStorage.setItem('Username', username);
      localStorage.setItem('TotalBidPoints', userdata.TotalBidPoints);
      localStorage.setItem('problemsetNo', userdata.problemsetNo);
      
      navigate("/Auction"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{userexist ? "Login" : "Signup"}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAuth}>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit">{userexist ? "Login" : "Signup"}</button>
      </form>
    </div>
  );
};

export default Auth;
