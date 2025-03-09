import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseconfig";

const FetchPsowned = () => {
    const [ownedps, setOwnedps] = useState([]);

    const username = localStorage.getItem("Username");
    
    useEffect(() => {
        if (!username) return; // Prevent errors if username is null

        const psRef = doc(db, "users", username);
        const unsubscribe = onSnapshot(psRef, (docSnap) => {
            if (docSnap.exists()) {
                setOwnedps(docSnap.data().ProblemStatement || []); 
            }
        });

        return () => unsubscribe();
    }, [username]); // Dependency added to update when username changes

    return (
        <div className = "blackbox">
            <h3>Owned Problem Statements</h3>
            {ownedps.length > 0 ? (
                <ul>
                    {ownedps.map((ps, index) => (
                        <li key={index}>
                            <strong>Title:</strong> {ps.Title} <br />
                            <strong>Type:</strong> {ps.Type} <br />
                            <strong>PS No:</strong> {ps.PsNo}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No owned problem statements found.</p>
            )}
        </div>
    );
};

export default FetchPsowned;
