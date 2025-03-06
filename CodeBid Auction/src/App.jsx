import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Auction from "./Pages/Auction"; // Create a simple main page component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/mainpage" element={<Auction />} />
      </Routes>
    </Router>
  );
};

export default App;
