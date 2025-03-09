import { useEffect, useState, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseconfig";
import "../styles/Auction.css"

const TimerAndPs = () => {
    const [currentPs, setCurrentPs] = useState(null);
    const [timer, setTimer] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        // Listen for real-time updates in Current Problem Statement
        const psRef = doc(db, "AdminDetails", "CurrentPs");
        const unsubscribePs = onSnapshot(psRef, (docSnap) => {
            if (docSnap.exists()) {
                setCurrentPs(docSnap.data());
            }
        }, (error) => console.error("Error fetching problem statement:", error));

        // Listen for real-time updates in Timer
        const timerRef = doc(db, "AdminDetails", "AdminLoginInfo");
        const unsubscribeTimer = onSnapshot(timerRef, (docSnap) => {
            if (docSnap.exists()) {
                const newTimer = docSnap.data().timer || 0;
                setTimer(newTimer);

                // Clear existing interval and start a new one if the timer is active
                if (intervalRef.current) clearInterval(intervalRef.current);
                
                if (newTimer > 0) {
                    intervalRef.current = setInterval(() => {
                        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
                    }, 1000);
                }
            }
        }, (error) => console.error("Error fetching timer:", error));

        // Cleanup function to unsubscribe and clear interval on unmount
        return () => {
            unsubscribePs();
            unsubscribeTimer();
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <>
            <div className="blackbox">
                {/* <h1>User Dashboard</h1> */}

                {currentPs ? (
                    <div className="problem-statement">
                        <h3>Problem Statement</h3>
                        <p><strong>PsNo:</strong> {currentPs.PsNo}</p>
                        <p><strong>Title:</strong> {currentPs.Title}</p>
                        <p><strong>Type:</strong> {currentPs.Type === "H" ? "High" : currentPs.Type === "M" ? "Medium" : "None"}</p>
                        <p><strong>Base Points:</strong> {currentPs.BasePoints}</p>
                    </div>
                ) : (
                    <p>Loading Problem Statement...</p>
                )}

            </div>
            <div className="blackbox">
                <h2>Time Left: {timer}s</h2>
            </div>
        </>
        
    );
};

export default TimerAndPs;
