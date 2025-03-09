import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseconfig";
import { BidPointsButton } from "./Bid";
import FetchPsowned from "./ownedps";
import TimerAndPs from "./fetchcurrentpsandTimer";
import "../styles/Auction.css"

const Auction = () => {
  const [highestBid, setHighestBid] = useState(0);
  const [BidderName, setBidderName] = useState("");
  const [name, setname] = useState("");
  const navigate = useNavigate();

  const u_name= localStorage.getItem('Username');


  useEffect(() => {
    const highestBidDoc = doc(db, "LiveAuction", "HigestBid");

    setname(u_name);
    // Real-time listener for highest bid updates
    const unsubscribe = onSnapshot(highestBidDoc, (snapshot) => {
      if (snapshot.exists()) {
        setHighestBid(Number(snapshot.data().HigestBid) || 0);
        setBidderName(String(snapshot.data().TeamName));
        
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleLogOut = () => {
    console.log("Logged Out");
    localStorage.removeItem("Username");
    localStorage.removeItem("TotalBidPoints");
    localStorage.removeItem("problemsetNo");
    navigate("/");
  };

  return (
    // <>
    //   {/* <h1>Welcome to the Auction Page!</h1> */}
    //   <h1>TECHMAZE PRESENTS CODEFIESTA 2.0</h1>
    //   <div>
    //   <TimerAndPs />
    //     <div className="blackbox">
    //       <h2>Highest Bid: {highestBid}</h2>
    //       <h2>Name: {BidderName}</h2>
    //     </div>
    //     <BidPointsButton />
    //     <FetchPsowned />
    //     <button onClick={handleLogOut} className = "blackbox">
    //       Logout
    //     </button>
    //   </div>
      
    // </>
  
  
  <>
  <div className="auction-container">
    <h1>TECHMAZE PRESENTS CODEFIESTA 2.0</h1>

    <div className="content-wrapper">
      {/* Left Section */}
      <div className="left-section">
        <TimerAndPs />
      </div>

      {/* Middle Section */}
      <div className="middle-section">
        <div className="blackbox">
          <h2>Highest Bid: {highestBid}</h2>
          <h2>Name: {BidderName}</h2>
        </div>
        <BidPointsButton />
      </div>

      {/* Right Section */}
      <div className="right-section">
        <h3>Your Name: {name}</h3>
        <div className="owned-ps-container">
          <FetchPsowned />
        </div>
      </div>
    </div>

    {/* Logout Button */}
    <button onClick={handleLogOut} className="logout-button fixed-logout">
      Logout
    </button>
  </div>
</>



  
    
  );
};

export default Auction;
