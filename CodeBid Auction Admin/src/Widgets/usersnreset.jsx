import React, { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, updateDoc, getDocs } from 'firebase/firestore';
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

    return (
        <>
            <div className="active-users-container">
                <h3>Active Users</h3>
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
        </>
    );
};

export default ActiveUsers;
