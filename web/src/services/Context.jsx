import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { ME } from "graphql/queries";
import { Toast } from "primereact/toast";
import { useCallback } from "react";
import { useLazyQuery } from "@apollo/client";

const Context = createContext({});

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null),
    [getUser, { data: userData, loading: userIsLoading, error }] = useLazyQuery(ME),
    [token, setToken] = useState(null),
    toast = useRef(null);

  const toastMessage = ({
    severity = "error",
    summary = "Título",
    detail = "Conteúdo da Mensagem",
  }) => {
    toast.current.show({ severity, summary, detail });
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData) {
      setUser(userData.me);
    }
    if (error) {
      toastMessage({ summary: "Erro", detail: error.message });
    }
  }, [userData, error]);

  useEffect(() => {
    if (token) {
      // Cadastra o token em local Storage
      localStorage.setItem("meuspacientes:token", token);
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const logout = useCallback(() => {
    localStorage.removeItem("meuspacientes:token");
    setUser(null);
  }, []);

  return (
    <Context.Provider
      value={{ user, setUser, logout, userIsLoading, setToken, toastMessage }}
    >
      <Toast ref={toast} />
      {children}
    </Context.Provider>
  );
};

const useAppContext = () => useContext(Context);

export { useAppContext };
export default ContextProvider;
