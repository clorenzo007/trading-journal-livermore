import { createContext, useContext, useEffect, useState } from "react";
import { getAccounts, activateAccount as activateAccountApi } from "../services/accounts";
import { useAuth } from "./AuthContext";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const { token, loading: authLoading } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Normaliza cualquier formato de respuesta
  const normalizeList = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.accounts)) return res.accounts;
    if (Array.isArray(res?.result)) return res.result;
    return [];
  };

  /**
   * Refreshes the list of accounts from the backend.
   * Synchronizes the `activeAccount` state with:
   * 1. The account marked as 'active' in the DB.
   * 2. Or the account ID saved in localStorage (if valid).
   * 3. Or falls back to null.
   */
  const refreshAccounts = async () => {
    const res = await getAccounts();
    const list = normalizeList(res);

    setAccounts(list);

    const savedId = localStorage.getItem("activeAccountId");
    
    // Priority:
    // 1. Database 'active' status (True Synchronization)
    // 2. LocalStorage selection (Client preference)
    const activeFromDb = list.find((a) => a?.status === "active") || null;
    const savedMatch = savedId
      ? list.find((a) => a?._id === savedId) || null
      : null;

    const chosen = activeFromDb || savedMatch || null;

    setActiveAccount(chosen);

    if (chosen?._id) {
      localStorage.setItem("activeAccountId", chosen._id);
    } else {
      localStorage.removeItem("activeAccountId");
    }
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
      .catch((err) => console.error("REFRESH ACCOUNTS ERROR:", err))
      .finally(() => setLoading(false));
  }, [token, authLoading]);

  const changeAccount = async (id) => {
    try {
      // 1. Activar en backend (Atómico)
      const updated = await activateAccountApi(id);
      
      // 2. Actualizar estado local
      setActiveAccount(updated);
      localStorage.setItem("activeAccountId", updated._id);

      // 3. Refrescar lista completa para actualizar los statuses de los demás
      await refreshAccounts();
    } catch (err) {
      console.error("CHANGE ACCOUNT ERROR:", err);
      alert("Error al activar la cuenta");
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
