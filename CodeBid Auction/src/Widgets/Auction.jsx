import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebaseconfig";
import { BidPointsButton } from "./Bid";
 
const Auction = () => {

  const [HigestBid, setHigestBid] = useState(0);

  const HigestBidDoc = doc(db, "LiveAuction", "HigestBid");

  useEffect(() => {
    const fetchBid = async () => {
        try {
            const getdocfield = await getDoc(HigestBidDoc);
            if (getdocfield.exists()) {
                const HigestBid = parseInt(getdocfield.data().HigestBid);
                setHigestBid(HigestBid);
            } else {
                console.log("No bid data found.");
            }
        } 
        catch (error) {
            console.error("Error fetching bid:", error.message);
        }
      };
    fetchBid();
  }, []);
  

  const navigate = useNavigate();
  
  const handleLogOut = async () => {
    try{
      console.log("LoggedOut");
      localStorage.removeItem('Username');
      localStorage.removeItem('TotalBidPoints');
      localStorage.removeItem('problemsetNo');
      navigate("/");
    }
    catch(err){
      console.error("Error logging out:", err.message);
    }
  };

  return (
    <>
      <h1>Welcome to the Auction Page!</h1>
      <h2>Higgest Bid: {HigestBid}</h2>
      <button onClick = { handleLogOut } className="logout_btn"> Logout </button>
      <BidPointsButton></BidPointsButton>
    </>
  )

};


export default Auction;
