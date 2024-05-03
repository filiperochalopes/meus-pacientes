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
import LabTestForm from "views/LabTestForm";
import LabTestEditForm from "views/LabTestEditForm";
import LabTestCheck from "views/LabTestCheck";

const RouteList = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Navigate to="/login" replace />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/cadastro/exames" element={<LabTestForm />} />
        <Route exact path="/editar/exames" element={<LabTestEditForm />} />
        {/* <Route exact path="/cadastro/gestantes" element={<PregnantForm />} /> */}
        <Route exact path="/meu-exame-chegou" element={<LabTestCheck />} />
        <Route exact path="/passelivre" element={<PrescrictionList />} />
        {/* <Route exact path="/gestantes" element={<PregnantList />} /> */}
      </Routes>
    </Router>
  );
};

export default RouteList;
