import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from "./firebaseconfig";
import "../Styles/fetch.css";

const FetchPs = () => {
    const [problemStatements, setProblemStatements] = useState([]);
    const [selectedPsNo, setSelectedPsNo] = useState("");
    const [currentPs, setCurrentPs] = useState(null);

    // Function to update the currently active problem statement
    const updateDetailsOfPs = async () => {
        const selectedPs = problemStatements.find(ps => ps.psno === selectedPsNo);

        if (!selectedPs) {
            console.log("Selected problem statement not found!");
            return;
        }

        try {
            await updateDoc(doc(db, 'AdminDetails', 'CurrentPs'), {
                PsNo: selectedPs.psno,
                BasePoints: selectedPs.basePrice,
                Title: selectedPs.title,
                Type: selectedPs.type
            });

            console.log("Problem Statement updated successfully!");
        } catch (error) {
            console.log("Error in Updating Doc", error.message);
        }
    };

    useEffect(() => {
        const psCollectionRef = collection(db, 'ProblemStatement');

        // Listening for real-time updates in problem statements
        const unsubscribe = onSnapshot(psCollectionRef, (snapshot) => {
            let problemStatementsArray = [];

            snapshot.forEach((doc) => {
                problemStatementsArray.push({
                    psno: doc.id,
                    basePrice: doc.data().BasePoints,
                    title: doc.data().Title,
                    type: doc.data().Type
                });
            });

            setProblemStatements(problemStatementsArray);

            if (problemStatementsArray.length > 0) {
                setSelectedPsNo(problemStatementsArray[0].psno);
            }
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    useEffect(() => {
        const docRef = doc(db, 'AdminDetails', 'CurrentPs');

        // Listening for real-time updates in the current problem statement
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setCurrentPs(data);

                localStorage.setItem('PsNo', data.PsNo);
                localStorage.setItem('Title', data.Title);
                localStorage.setItem('Type', data.Type);
            }
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    return (
        <div>
            <div className="ps-select">

            <label htmlFor="psno" className="ps-dropdown-label">Select Ps No</label>
            
            <select 
                name="psno" 
                id="psno"
                value={selectedPsNo}
                onChange={(e) => setSelectedPsNo(e.target.value)} 
                className="ps-dropdown"
            >
                {problemStatements.map((ps, index) => (
                    <option key={index} value={ps.psno}>{ps.psno}</option>
                ))}
            </select>

            <button onClick={updateDetailsOfPs} className="ps-dropdown-update">Update Ps Details</button>

            </div>
            {currentPs && (
                <div>
                    <h3>PsNo: {currentPs.PsNo}</h3>
                    
                    <p>Title: {currentPs.Title}</p>
                    <div className='flex-row'>
                    <p>Base Points: {currentPs.BasePoints}</p>

                    <p>Type: {currentPs.Type === 'H' ? 'Hard' : currentPs.Type === 'M' ? 'Medium' : 'None'}</p>
                    </div>

                </div>
            )}
        </div>
    );
};

export default FetchPs;
    