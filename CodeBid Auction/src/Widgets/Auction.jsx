import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseconfig";
import { BidPointsButton } from "./Bid";
import FetchPsowned from "./ownedps";
import TimerAndPs from "./fetchcurrentpsandTimer";

const Auction = () => {
  const [highestBid, setHighestBid] = useState(0);
  const [BidderName, setBidderName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const highestBidDoc = doc(db, "LiveAuction", "HigestBid");

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
    <>
      {/* <h1>Welcome to the Auction Page!</h1> */}
      <TimerAndPs />
      <h2>Highest Bid: {highestBid}</h2>
      <h2>Name: {BidderName}</h2>
      <button onClick={handleLogOut} className="logout_btn">
        Logout
      </button>
      
      <BidPointsButton />
      <FetchPsowned />
    </>
  );
};

export default Auction;
