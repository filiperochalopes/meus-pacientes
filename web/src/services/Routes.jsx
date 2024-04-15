import React from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import Login from "views/Login";
import Home from "views/Home";
import PrescrictionList from "views/PrescriptionList";

const RouteList = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Navigate to="/login" replace />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/passelivre" element={<PrescrictionList />} />
      </Routes>
    </Router>
  );
};

export default RouteList;
