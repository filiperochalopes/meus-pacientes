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
import { useQuery } from "@apollo/client";

const Context = createContext({});

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null),
    {data:userData, loading:userIsLoading, error} = useQuery(ME),
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
    console.log("Loading page");
    if (!userIsLoading && !userData?.id && !error) {
      console.log(userIsLoading, userData, error);
    }
    if (userData) {
      setUser(userData.me);
    }
    if (error) {
      toastMessage({ summary: "Erro", detail: error.message });
    }
  }, [userIsLoading, userData, error]);

  useEffect(() => {
    // Caso exista token, verifica sua validação
    if (token && user?.id) {
      // Cadastra o token em local Storage
      localStorage.setItem("meuspacientes:token", token);
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
