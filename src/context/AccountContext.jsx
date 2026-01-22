import { createContext, useContext, useEffect, useState } from "react";
import { getAccounts } from "../services/accounts";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const list = await getAccounts();
        setAccounts(list);

        const saved = localStorage.getItem("activeAccountId");
        let selected =
          list.find((a) => a.id === saved && a.status === "active") ||
          list.find((a) => a.status === "active") ||
          null;

        if (selected) {
          setActiveAccount(selected);
          localStorage.setItem("activeAccountId", selected.id);
        }
      } catch (err) {
        console.error("INIT ACCOUNTS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const changeAccount = (id) => {
    const acc = accounts.find((a) => a.id === id);
    if (!acc) return;
    setActiveAccount(acc);
    localStorage.setItem("activeAccountId", acc.id);
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
