import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebaseconfig";

const BidPointsButton = () => {
    const [currentbid, setCurrentBid] = useState(0);
    const [totalbidpoints, setTotalBidPoints] = useState(0);
    const [error, setError] = useState("");

    const username = localStorage.getItem("Username");

    const CurrentBidDoc = doc(db, "LiveAuction", username);
    const userDoc = doc(db, "users", username);
    const adminDoc = doc(db, "AdminDetails", "AdminLoginInfo");

    useEffect(() => {
        const unsubscribeUser = onSnapshot(userDoc, (docSnap) => {
            if (docSnap.exists()) {
                setTotalBidPoints(parseInt(docSnap.data()?.TotalBidPoints || 0));
            }
        }, (error) => console.error("Error fetching bid points:", error.message));

        const unsubscribeBid = onSnapshot(CurrentBidDoc, (docSnap) => {
            if (docSnap.exists()) {
                setCurrentBid(parseInt(docSnap.data()?.currentBid || 0));
            }
        }, (error) => console.error("Error fetching bid:", error.message));

        return () => {
            unsubscribeUser();
            unsubscribeBid();
        };
    }, []);

    const updateBidPts = async (value) => {
        try {
            const newBid = value + currentbid;
            if (totalbidpoints < newBid) {
                setError("Not enough bid points!");
                return;
            }

            const adminDocSnapshot = await getDoc(adminDoc);
            const canWrite = adminDocSnapshot.exists() ? adminDocSnapshot.data()?.canWrite : false;

            if (canWrite) {
                await updateDoc(CurrentBidDoc, { currentBid: newBid });
            }
        } catch (error) {
            console.error("Error updating bid:", error.message);
        }
    };

    return (
        <>
            <h3>Your Current Bid: {currentbid}</h3>
            <h3>Total Bid: {totalbidpoints}</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div>
                <button onClick={() => updateBidPts(10)}>Bid For 10 pts</button>
                <button onClick={() => updateBidPts(20)}>Bid For 20 pts</button>
                <button onClick={() => updateBidPts(50)}>Bid For 50 pts</button>
            </div>
        </>
    );
};

export { BidPointsButton };
