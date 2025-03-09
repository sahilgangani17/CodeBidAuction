import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebaseconfig";

const BidPointsButton = () => {
    const [currentbid, setCurrentBid] = useState(0);
    const [totalbidpoints, setTotalBidPoints] = useState(0);
    const [error, setError] = useState("");
    const [basePoints, setBasePoints] = useState(0);

    const username = localStorage.getItem("Username");

    const CurrentBidDoc = doc(db, "LiveAuction", username);
    const userDoc = doc(db, "users", username);
    const adminDoc = doc(db, "AdminDetails", "AdminLoginInfo");
    const currentPsDoc = doc(db, "AdminDetails", "CurrentPs");

    useEffect(() => {
        // Fetch BasePoints initially
        const fetchBasePoints = async () => {
            try {
                const psDocSnap = await getDoc(currentPsDoc);
                if (psDocSnap.exists()) {
                    const base = psDocSnap.data()?.BasePoints || 0;
                    setBasePoints(base);

                    // Optional: If currentbid is 0, start from BasePoints
                    setCurrentBid(base);
                }
            } catch (error) {
                console.error("Error fetching BasePoints:", error.message);
            }
        };

        fetchBasePoints();

        // Realtime listener for user total bid points
        const unsubscribeUser = onSnapshot(userDoc, (docSnap) => {
            if (docSnap.exists()) {
                setTotalBidPoints(parseInt(docSnap.data()?.TotalBidPoints || 0));
            }
        }, (error) => console.error("Error fetching bid points:", error.message));

        // Realtime listener for current bid (override base points if already set)
        const unsubscribeBid = onSnapshot(CurrentBidDoc, (docSnap) => {
            if (docSnap.exists()) {
                const liveBid = parseInt(docSnap.data()?.currentBid || 0);
                if (liveBid > 0) {
                    setCurrentBid(liveBid);
                }
            }
        }, (error) => console.error("Error fetching bid:", error.message));

        return () => {
            unsubscribeUser();
            unsubscribeBid();
        };
    }, []);

    const updateBidPts = async (value) => {
        try {
            const newBid = currentbid + value;
            if (totalbidpoints < newBid) {
                setError("Not enough bid points!");
                return;
            }

            const adminDocSnapshot = await getDoc(adminDoc);
            const canWrite = adminDocSnapshot.exists() ? adminDocSnapshot.data()?.canWrite : false;

            if (canWrite) {
                await updateDoc(CurrentBidDoc, { currentBid: newBid });
            } else {
                setError("Admin has locked the bids!");
            }
        } catch (error) {
            console.error("Error updating bid:", error.message);
        }
    };

    return (
        <>
            <h3>Your Current Bid: {currentbid}</h3>
            <h3>Total Bid Points Available: {totalbidpoints}</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div>
                <button onClick={() => updateBidPts(10)}>Bid +10 pts</button>
                <button onClick={() => updateBidPts(20)}>Bid +20 pts</button>
                <button onClick={() => updateBidPts(50)}>Bid +50 pts</button>
            </div>
        </>
    );
};

export { BidPointsButton };
