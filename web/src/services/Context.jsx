import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import apolloClient from "services/apiClient";
import { ME } from "graphql/queries";
import { Toast } from "primereact/toast";

const Context = createContext({});

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(),
    [userIsLoading, setUserIsLoading] = useState(true),
    [token, setToken] = useState(null),
    navigate = useNavigate(),
    toast = useRef(null);

  const toastMessage = ({
    severity = "error",
    summary = "Título",
    detail = "Conteúdo da Mensagem",
  }) => {
    toast.current.show({ severity, summary, detail });
  };

  useEffect(() => {
    // Caso exista token, verifica sua validação
    if (token) {
      // Cadastra o token em local Storage
      localStorage.setItem("meuspacientes:token", token);
      // Captura dados do usuário para utilizar
      apolloClient
        .query({
          query: ME,
        })
        .then(({ data: { me } }) => {
          setUser(me);
        })
        .catch((error) => {
          setUser(null);
          toastMessage({
            severity: "error",
            summary: "Erro de Autenticação",
            detail: error.message,
          });
        })
        .finally(() => {
          setUserIsLoading(false);
        });
    } else {
      setUser(null);
      localStorage.removeItem("meuspacientes:token");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function logout() {
    localStorage.removeItem("meuspacientes:token");
    setUser(undefined);
    navigate("/", { replace: true });
  }

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
