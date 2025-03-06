import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseconfig";

const Auction = () => {

  const navigate = useNavigate();
  
  const handleLogOut = async () => {
    try{
      await signOut(auth);
      console.log("LoggedOut")
      navigate("/");
    }
    catch(err){
      console.error("Error logging out:", err.message);
    }
  };

  return (
    <>
      <h1>Welcome to the Main Page!</h1>
      <button onClick = { handleLogOut } className="logout_btn"> Logout </button>
    </>
  )

};


export default Auction;
