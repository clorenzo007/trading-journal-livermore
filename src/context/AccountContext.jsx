import { createContext, useContext, useEffect, useState } from "react";
import { getAccounts } from "../services/accounts";
import { useAuth } from "./AuthContext";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const { token, loading: authLoading } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 SOLO CARGA CUENTAS CUANDO YA EXISTE TOKEN
  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setLoading(false);
      return;
    }

    async function init() {
      try {
        setLoading(true);

        const list = await getAccounts();
        setAccounts(list);

        const saved = localStorage.getItem("activeAccountId");

        const selected =
          list.find((a) => a._id === saved && a.status === "active") ||
          list.find((a) => a.status === "active") ||
          null;

        if (selected) {
          setActiveAccount(selected);
          localStorage.setItem("activeAccountId", selected._id);
        }
      } catch (err) {
        console.error("INIT ACCOUNTS ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [token, authLoading]);

  const changeAccount = (id) => {
    const acc = accounts.find((a) => a._id === id);
    if (!acc) return;
    setActiveAccount(acc);
    localStorage.setItem("activeAccountId", acc._id);
  };

  return (
    <AccountContext.Provider
      value={{
        accounts,
        activeAccount,
        setAccounts,
        changeAccount,
        loading,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
