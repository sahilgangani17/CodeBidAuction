import React, { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, updateDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebaseconfig';
import "../Styles/activeuser.css";

const ActiveUsers = () => {
    const [userdata, setUserdata] = useState([]);

    useEffect(() => {
        const auctionRef = collection(db, "LiveAuction");
        const usersRef = collection(db, "users");

        // Listen for real-time updates from LiveAuction
        const unsubscribeAuction = onSnapshot(auctionRef, (auctionSnapshot) => {
            let userDetails = [];

            auctionSnapshot.docs.forEach((userdoc) => {
                const username = userdoc.id;
                if (username === "HigestBid") return;

                userDetails.push({
                    username,
                    bidPoints: userdoc.data().currentBid || 0,
                    totalPoints: 0, // This will be updated from users collection
                });
            });

            // Listen for real-time updates from users collection
            const unsubscribeUsers = onSnapshot(usersRef, (usersSnapshot) => {
                const usersMap = {};
                usersSnapshot.docs.forEach((doc) => {
                    usersMap[doc.id] = doc.data().TotalBidPoints || 0;
                });

                // Merge both collections
                const updatedUserData = userDetails.map((user) => ({
                    ...user,
                    totalPoints: usersMap[user.username] || 0,
                }));

                setUserdata(updatedUserData);
            });

            return () => unsubscribeUsers();
        });

        return () => unsubscribeAuction();
    }, []);
    

    const resetbid = async () => {
    try {
        const auctionRef = collection(db, 'LiveAuction');
        const snapshot = await getDocs(auctionRef);

        const resetPromises = snapshot.docs.map(async (docSnap) => {
            const username = docSnap.id;

            // Skip the document if it's "HigestBid" (typo? Should it be "HighestBid"?)
            
            const userDocRef = doc(db, 'LiveAuction', username);
            if (username === "HigestBid"){
                await updateDoc(userDocRef,{
                    HigestBid : 0,
                    TeamName : "",
                    timestamp: Date.now()
                }

                )
            }
            else {
                await updateDoc(userDocRef, {
                    currentBid: 0,
                });
            }
           
        });

        await Promise.all(resetPromises);
        console.log("All bids have been reset!");
    } catch (error) {
        console.error("Error in resetting bids:", error);
    }
};


    return (
        <>

            <div className="active-users-container">
                {/* <h3>Active Users</h3> */}
                <div>
                    {userdata.map((user, index) => (
                        <div key={index} className="user-card">
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Bid Points:</strong> {user.bidPoints}</p>
                            <p><strong>Total Points:</strong> {user.totalPoints}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className='reset-bid-container'>
            <button onClick={resetbid} className='reset-bid-button'>Reset Bid</button>
            </div>
                
        </>
    );
};

export default ActiveUsers;
