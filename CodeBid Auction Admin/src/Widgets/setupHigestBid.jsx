import { useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebaseconfig";

const UpdateHighestBid = () => {
    useEffect(() => {
        const fetchAndUpdateHighestBid = async () => {
            try {
                const liveAuctionRef = collection(db, "LiveAuction");
                const snapshot = await getDocs(liveAuctionRef);

                let highestBid = 0;
                let highestBidder = "";

                snapshot.forEach((userDoc) => {
                    if (userDoc.id !== "HigestBid") {
                        const userBid = userDoc.data().currentBid || 0;
                        if (userBid > highestBid) {
                            highestBid = userBid;
                            highestBidder = userDoc.id;
                        }
                    }
                });

                // Update the highest bid in Firestore
                const highestBidRef = doc(db, "LiveAuction", "HigestBid");
                await updateDoc(highestBidRef, {
                    HigestBid: highestBid,
                    TeamName: highestBidder,
                });

                console.log("Highest bid updated successfully!");
            } catch (error) {
                console.error("Error updating highest bid:", error);
            }
        };

        fetchAndUpdateHighestBid();

        const interval = setInterval(fetchAndUpdateHighestBid, 1000);

        return () => clearInterval(interval);
    }, []);

    return null; 
};

export default UpdateHighestBid;
