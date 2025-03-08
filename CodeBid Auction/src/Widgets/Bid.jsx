import React,{ useEffect, useState} from "react";
import {getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseconfig";
import { use } from "react";

const BidPointsButton = () => {

    const [currentBid, setcurrentbid] = useState(0);
    const [totalbidpoints,  settotalbidpoints] = useState(0);
    const [error, setError] = useState("");

    const username = localStorage.getItem('Username')
    const Uid = localStorage.getItem('Uid');

    const CurrentBidDoc = doc(db, "LiveAuction", username);
    const userdoc = doc(db, 'users', Uid);

    useEffect(()=>{
        const fetchtotalbidpoints = async () => {
            try{
                const getuserdocfield = await getDoc(userdoc);
                if (getuserdocfield.exists()){
                    const totalbidpoints = parseInt(getuserdocfield.data().bidpoints);
                    settotalbidpoints(totalbidpoints);
                }
                else{
                    console.error("No data Exits");
                }
            } 
            catch (error) {
                console.error("Error in Fetching Bid Points", error.message);
            }
        }
        fetchtotalbidpoints();
    }, []);

    useEffect(() => {
        const fetchBid = async () => {
            try {
                const getdocfield = await getDoc(CurrentBidDoc);
                if (getdocfield.exists()) {
                    const currentPreviousbid = parseInt(getdocfield.data().currentBid);
                    setcurrentbid(currentPreviousbid);
                } else {
                    console.log("No bid data found.");
                }
            } catch (error) {
                console.error("Error fetching bid:", error.message);
            }
        };
        fetchBid();
    }, []);

    const  updateBidPts = async (value) => {
        try {
            var newbid = value + currentBid;

            await updateDoc(CurrentBidDoc, {
                currentBid: newbid
            });

            setcurrentbid(newbid);
            console.log(`Bid updated to ${newbid} points`);
        } catch (error) {
            console.error("Error updating bid:", error.message);
        }
    };

    return (
        <>
            <h3>Your Current Bid: {currentBid}</h3>
            <h3>Total Bid: {totalbidpoints}</h3>
            {error && <p>{error}</p>}
            <div>
                <button onClick={() => updateBidPts(10)}>Bid For 10 pts</button>
            </div>
            <div>
                <button onClick={() => updateBidPts(20)}>Bid For 20 pts</button>
            </div>
            <div>
                <button onClick={() => updateBidPts(50)}>Bid For 50 pts</button>
            </div>
        
        </>
    );
    
}

export { BidPointsButton };