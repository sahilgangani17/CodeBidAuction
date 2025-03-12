import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseconfig"; 
import ActiveUsers from "./usersnreset";
import FetchPs from "./fetchps";
import UpdateHighestBid from "./setupHigestBid";
import "../Styles/Admindashboard.css";

const AdminDashboard = () => {
    const [canWrite, setCanWrite] = useState(false);
    const [timer, setTimer] = useState(0);
    const [highestBid, setHighestBid] = useState(0);
    const [BidderName, setBidderName] = useState("");
    const [granted, setgranted] = useState("");
    const intervalRef = useRef(null);
    const navigate = useNavigate();

    // Real-time listener for Admin settings
    useEffect(() => {
        const docRef = doc(db, "AdminDetails", "AdminLoginInfo");

        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            if (snapshot.exists()) {
                setCanWrite(snapshot.data().canWrite);
                setTimer(snapshot.data().timer || 0);
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    // Start bidding function
    // const startBidding = async () => {
    //     try {
    //         const docRef = doc(db, "AdminDetails", "AdminLoginInfo");

    //         await updateDoc(docRef, { canWrite: true, timer: 30 });
    //         setCanWrite(true);
    //         setTimer(30);

    //         intervalRef.current = setInterval(() => {
    //             setTimer(prev => {
    //                 if (prev <= 1) {
    //                     clearInterval(intervalRef.current);
    //                     stopBidding();
    //                     return 0;
    //                 }
    //                 return prev - 1;
    //             });
    //         }, 1000);
    //     } catch (error) {
    //         console.error("Error starting bidding:", error);
    //     }
    // };
    const startBidding = async () => {
        try {
          const docRef = doc(db, "AdminDetails", "AdminLoginInfo");
      
          // Set the initial state in Firebase
          await updateDoc(docRef, { canWrite: true, timer: 30 });
          setCanWrite(true);
          setTimer(30);
      
          intervalRef.current = setInterval(async () => {
            setTimer((prev) => {
              if (prev <= 1) {
                clearInterval(intervalRef.current);
                stopBidding();
                return 0;
              }
              const newTimer = prev - 1;
              // Update Firebase with the new timer value
              updateDoc(docRef, { timer: newTimer }).catch(console.error);
              return newTimer;
            });
          }, 1000);
        } catch (error) {
          console.error("Error starting bidding:", error);
        }
      };
      

    // Stop bidding function
    const stopBidding = async () => {
        try {
            const docRef = doc(db, "AdminDetails", "AdminLoginInfo");
            await updateDoc(docRef, { canWrite: false, timer: 0 });
            setCanWrite(false);
            setTimer(0);
            clearInterval(intervalRef.current);
        } catch (error) {
            console.error("Error stopping bidding:", error);
        }
    };

    // Logout function
    const handleLogOut = () => {
        try {
            localStorage.removeItem("Admin");
            localStorage.removeItem('PsNo');
            localStorage.removeItem('Title');
            localStorage.removeItem('Type');
            navigate("/");
        } catch (error) {
            console.log("Error logging out", error.message);
        }
    };

    // Real-time listener for highest bid updates
    useEffect(() => {
        const highestBidDoc = doc(db, "LiveAuction", "HigestBid");

        const unsubscribe = onSnapshot(highestBidDoc, (snapshot) => {
            if (snapshot.exists()) {
                setHighestBid(Number(snapshot.data().HigestBid) || 0);
                setBidderName(String(snapshot.data().TeamName));
            }
        });

        return () => unsubscribe();
    }, []);

    // Grant Problem Statement function
    const grantps = async () => {

        if(canWrite){
            setgranted("Cannot Grant");
            return;
        }

        if (!BidderName) {
            console.log("No bidder found.");
            return;
        }
    
        const userRef = doc(db, "users", BidderName);
    
        try {
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                const existingPs = userData.ProblemStatement || [];
                const totalBidPoints = userData.TotalBidPoints || 1000;
    
                const psno = localStorage.getItem('PsNo');
                const Title = localStorage.getItem('Title');
                const Type = localStorage.getItem('Type');
    
                const newPs = { PsNo: psno, Title, Type };
                const updatedPs = [...existingPs, newPs];
    
                // Ensure the user has enough points
                if (totalBidPoints >= highestBid) {
                    const newTotalBidPoints = totalBidPoints - highestBid;
    
                    await updateDoc(userRef, {
                        ProblemStatement: updatedPs,
                        TotalBidPoints: newTotalBidPoints // Deduct bid points
                    });
    
                    console.log(`Updated TotalBidPoints for ${BidderName}: ${newTotalBidPoints}`);
                    setgranted(`Problem Statement granted: ${newPs.PsNo} to ${BidderName}`);
                } else {
                    setgranted("Error: Not enough bid points!");
                }
            } else {
                setgranted("User document does not exist.");
            }
        } catch (error) {
            setgranted("Error in granting PS: " + error.message);
        }
    };
    
    

    return (
        // <>
        // <div className="dashboard-container">
        //     <h1 className="dashboard-title">Welcome to Admin Dashboard</h1>

        //     <div className="toggle-container">
        //         <span className="toggle-label">Can Write: {canWrite ? "ON" : "OFF"}</span>
        //         <button className="start-bidding" onClick={startBidding} disabled={canWrite}>
        //             Start Bidding
        //         </button>
        //         {canWrite && <span className="timer"> Time Left: {timer}s </span>}
        //     </div>

        //     <ActiveUsers />
        //     <FetchPs />

        //     <div>
        //         <UpdateHighestBid />
        //         <h3>Highest Bid: {highestBid}</h3>
        //         <h3>Name: {BidderName}</h3>
        //     </div>

        //     <button onClick={grantps}>Grant PS</button>
        //     {granted && <p>{granted}</p>}
            
        //     <button className="logout-button" onClick={handleLogOut}>
        //         Logout
        //     </button>
        // </div>
        // </>
        <>
        <div className="dashboard-wrapper">
          <div className="admin-dashboard-container">
            <h1 className="dashboard-title">Welcome to Admin Dashboard</h1>
      
            <div className="toggle-section">
              
              <span className="toggle-label">Can Write: <div class="ON-OFF">{canWrite ? "ON" : "OFF"}</div></span>
              
              <button className="start-bidding-button" onClick={startBidding} disabled={canWrite}>
                Start Bidding
              </button>
              
            </div>

            {canWrite && <div className="timer-display">Time Left: {timer}s</div>}
      
            <div className="cards-section">
              
              <div className="card">
                <h2>Active Users</h2>
                <ActiveUsers />
              </div>
      
              <div className="card">
                <h2>Fetch PS</h2>
                <FetchPs />
              </div>
      
              <div className="card">
                
                <h2>Highest Bid</h2>

                <div className="flex-row">
                
                <p className="bidder-name">Name:  {BidderName}</p>

                <p className="bid-value">Highest Bid: {highestBid}</p>
                
                <UpdateHighestBid />
                </div>
              </div>
      
              <div className="card">
                <button className="grant-ps-button" onClick={grantps}>
                  Grant PS
                </button>
                {granted && <p className="granted-message">{granted}</p>}
              </div>
            </div>
      
            <button className="logout-button" onClick={handleLogOut}>
              Logout
            </button>
          </div>
        </div>
      </>
      

       
    );
};

export default AdminDashboard;
