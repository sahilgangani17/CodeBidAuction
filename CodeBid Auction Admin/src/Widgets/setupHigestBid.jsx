import { useEffect } from "react";
import { collection, getDocs, updateDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseconfig";

const UpdateHighestBid = () => {
    useEffect(() => {
        const fetchAndUpdateHighestBid = async () => {
            try {
                const liveAuctionRef = collection(db, "LiveAuction");
                const highestBidRef = doc(db, "LiveAuction", "HigestBid");

                // Fetch the current highest bid document
                const highestBidDoc = await getDoc(highestBidRef);
                let currentHighestBid = 0;
                let currentHighestBidder = "";
                let currentHighestTimestamp = 0;

                if (highestBidDoc.exists()) {
                    const data = highestBidDoc.data();
                    currentHighestBid = data.HigestBid || 0;
                    currentHighestBidder = data.TeamName || "";
                    currentHighestTimestamp = data.timestamp;
                }
                console.log(currentHighestTimestamp);

                let newHighestBid = currentHighestBid;
                let newHighestBidder = currentHighestBidder;
                let newHighestTimestamp = currentHighestTimestamp;

                const snapshot = await getDocs(liveAuctionRef);
                
                snapshot.forEach((userDoc) => {
                    if (userDoc.id !== "HigestBid") {
                        const userData = userDoc.data();
                        const userBid = userData.currentBid || 0;

                        if (userBid > newHighestBid) {
                            newHighestBid = userBid;
                            newHighestBidder = userDoc.id;
                            newHighestTimestamp = Date.now(); // Use current timestamp
                        }
                    }
                });

                // Only update if there's a new highest bid or a different highest bidder
                if (newHighestBid > currentHighestBid || (newHighestBid === currentHighestBid && newHighestTimestamp < currentHighestTimestamp)) {
                    await updateDoc(highestBidRef, {
                        HigestBid: newHighestBid,
                        TeamName: newHighestBidder,
                        timestamp: serverTimestamp(),
                    });

                    console.log("Highest bid updated successfully!");
                }
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
