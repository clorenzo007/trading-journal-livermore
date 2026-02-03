import { createContext, useContext, useEffect, useState } from "react";
import { getAccounts, activateAccount } from "../services/accounts";
import { useAuth } from "./AuthContext";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const { token, loading: authLoading } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Soporta api() devolviendo: []  |  {data:[]}  | {accounts:[]}  | etc
  const normalizeList = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.accounts)) return res.accounts;
    if (Array.isArray(res?.result)) return res.result;
    return [];
  };

  const refreshAccounts = async () => {
    const res = await getAccounts();
    const list = normalizeList(res);

    setAccounts(list);

    const activeFromDb = list.find((a) => a?.status === "active") || null;

    const savedId = localStorage.getItem("activeAccountId");
    const savedMatch = savedId
      ? list.find((a) => a?._id === savedId) || null
      : null;

    const chosen = activeFromDb || savedMatch || null;

    setActiveAccount(chosen);

    if (chosen?._id) localStorage.setItem("activeAccountId", chosen._id);
    else localStorage.removeItem("activeAccountId");
  };

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setAccounts([]);
      setActiveAccount(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    refreshAccounts()
    console.log("ACCOUNTS RAW:", res);
console.log("ACCOUNTS LIST:", list);
console.log("ACTIVE PICK:", activeFromDb);

      .catch((err) => console.error("REFRESH ACCOUNTS ERROR:", err))
      .finally(() => setLoading(false));
  }, [token, authLoading]);

  const changeAccount = async (id) => {
    try {
      setLoading(true);
      await activateAccount(id); // 🔥 backend decide la activa real
      await refreshAccounts(); // 🔄 sincroniza UI con DB
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
