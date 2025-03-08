import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./Widgets/Auth";
import Auction from "./Widgets/Auction"; 

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect "/" to "/Auth" */}
        <Route path="/" element={<Navigate to="/Auth" />} />
        
        {/* Route for the Auth page */}
        <Route path="/Auth" element={<Auth />} />

        {/* Route for the Auction page */}
        <Route path="/Auction" element={<Auction />} />
      </Routes>
    </Router>
  );
};

export default App;
