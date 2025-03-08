import React, { useEffect, useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseconfig";

const BidPointsButton = () => {
    const [currentbid, setcurrentbid] = useState(0);
    const [totalbidpoints, settotalbidpoints] = useState(0);
    const [error, setError] = useState("");

    const username = localStorage.getItem("Username");

    const CurrentBidDoc = doc(db, "LiveAuction", username);
    const userdoc = doc(db, "users", username);

    useEffect(() => {
        const fetchtotalbidpoints = async () => {
            try {
                const getuserdocfield = await getDoc(userdoc);
                if (getuserdocfield.exists()) {
                    const total = parseInt(getuserdocfield.data()?.TotalBidPoints || 0);
                    settotalbidpoints(total);
                } else {
                    console.error("No data exists");
                }
            } catch (error) {
                console.error("Error fetching bid points:", error.message);
            }
        };
        fetchtotalbidpoints();
    }, [totalbidpoints]);

    useEffect(() => {
        const fetchBid = async () => {
            try {
                const getdocfield = await getDoc(CurrentBidDoc);
                if (getdocfield.exists()) {
                    const currentPreviousbid = parseInt(getdocfield.data()?.currentBid || 0);
                    setcurrentbid(currentPreviousbid);
                } else {
                    console.log("No bid data found.");
                }
            } catch (error) {
                console.error("Error fetching bid:", error.message);
            }
        };
        fetchBid();
    }, [currentbid]);

    const updateBidPts = async (value) => {
        try {
            var newbid = value + currentbid;

            if (totalbidpoints <  newbid) {
                setError("Not enough bid points!");
                return;
            }

            await updateDoc(CurrentBidDoc, { currentBid: newbid });
            // await updateDoc(userdoc, { bidpoints: totalbidpoints - value });

            setcurrentbid(newbid);
            // settotalbidpoints(totalbidpoints - value);
            // console.log(`Bid updated to ${newbid} points, remaining: ${totalbidpoints - value}`);
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
