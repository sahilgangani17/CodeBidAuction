  import React from "react";
  import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
  import { useAuthState } from "react-firebase-hooks/auth";
  import { auth } from "./Pages/firebaseconfig";
  import Auth from "./Pages/Auth";
  import Auction from "./Pages/Auction"; 

  const App = () => {
    const [user] = useAuthState(auth);

    return (
      <Router>
        <Routes>
          <Route path="/" element={ user ? <Navigate to="/Auction" /> : <Auth/> } />
          <Route path="/Auction" element={<Auction />} />
        </Routes>
      </Router>
    );
  };

  export default App;
