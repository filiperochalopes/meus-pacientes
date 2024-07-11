import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "views/Login";
import Home from "views/Home";
import PrescrictionList from "views/PrescriptionList";
import LabTestForm from "views/LabTestForm";
import LabTestEditForm from "views/LabTestEditForm";
import LabTestCheck from "views/LabTestCheck";
import PregnantList from "views/PregnantList";
import ContextProvider from "services/Context";

const RouteList = () => {
  return (
    <Router>
      <ContextProvider>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/cadastro/exames" element={<LabTestForm />} />
          <Route exact path="/editar/exames" element={<LabTestEditForm />} />
          <Route exact path="/meu-exame-chegou" element={<LabTestCheck />} />
          <Route exact path="/passe-livre" element={<PrescrictionList />} />
          <Route exact path="/gestantes" element={<PregnantList />} />
          {/* <Route exact path="/busca-ativa" element={<PregnantList />} /> */}
        </Routes>
      </ContextProvider>
    </Router>
  );
};

export default RouteList;
