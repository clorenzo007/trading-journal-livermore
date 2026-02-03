import { createContext, useContext, useEffect, useState } from "react";
import { getAccounts, activateAccount } from "../services/account";
import { useAuth } from "./AuthContext";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const { token, loading: authLoading } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Cargar cuentas desde backend
  const refreshAccounts = async () => {
    const list = await getAccounts();
    setAccounts(list);

    const active = list.find((a) => a.status === "active") || null;
    setActiveAccount(active);
  };

  // 🔥 Solo se ejecuta cuando hay sesión
  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setAccounts([]);
      setActiveAccount(null);
      setLoading(false);
      return;
    }

    refreshAccounts().finally(() => setLoading(false));
  }, [token, authLoading]);

  // 🔥 Activar cuenta REAL (backend)
  const changeAccount = async (id) => {
    try {
      setLoading(true);
      await activateAccount(id); // backend decide
      await refreshAccounts(); // frontend sincroniza
    } catch (err) {
      console.error("ACTIVATE ACCOUNT ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountContext.Provider
      value={{
        accounts,
        activeAccount,
        changeAccount,
        loading,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
