import React, { createContext, useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Context = createContext({});

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("meuspaciente:token");
    if (!token) {
      return;
    }

    const decode = jwt_decode(token);
    setUser({
      ...decode,
      token,
    });
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setUser(undefined);
    navigate("/", { replace: true });
  }

  return (
    <Context.Provider value={{ user, setUser, logout }}>
      {children}
    </Context.Provider>
  );
};

const useAppContext = () => useContext(Context);

export { useAppContext };
export default ContextProvider;
