import { useState, useEffect } from 'react';
import { Database, Wifi, WifiOff, Keyboard, Globe } from 'lucide-react';
import { api } from '../../api/api';
import { useLanguage } from '../../context/LanguageContext';

export default function StatusBar() {
  const [network, setNetwork] = useState(navigator.onLine);
  const [dbState, setDbState] = useState(null);
  const [capsLock, setCapsLock] = useState(false);
  const { lang, t } = useLanguage();

  useEffect(() => {
    const handleOnline = () => setNetwork(true);
    const handleOffline = () => setNetwork(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const checkDbStatus = async () => {
      try {
        const res = await api('/status');
        setDbState(res.dbState || res.readyState || 1); // fallback if not sure
      } catch (err) {
        setDbState(0);
      }
    };
    checkDbStatus();
    const interval = setInterval(checkDbStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeydown = (e) => {
      setCapsLock(e.getModifierState('CapsLock'));
    };
    const handleMousedown = (e) => {
      if (e.getModifierState) setCapsLock(e.getModifierState('CapsLock'));
    }
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeydown);
    window.addEventListener('mousedown', handleMousedown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('keyup', handleKeydown);
      window.removeEventListener('mousedown', handleMousedown);
    };
  }, []);

  let dbText = 'DB Disconnected';
  let dbColorClass = 'text-danger';
  if (dbState === 1) {
    dbText = 'DB Connected';
    dbColorClass = 'text-success';
  } else if (dbState === 2) {
    dbText = 'DB Connecting...';
    dbColorClass = 'text-warning';
  } else if (dbState === 3) {
    dbText = 'DB Disconnecting...';
    dbColorClass = 'text-warning';
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 text-zinc-400 border-t border-zinc-800 flex justify-between px-4 py-1.5 z-[1050] text-[0.75rem]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5" title={network ? t("Online") : t("Offline")}>
          {network ? <Wifi size={12} className="text-emerald-500" /> : <WifiOff size={12} className="text-rose-500" />}
          <span className="hidden sm:inline">{network ? t('Online') : t('Offline')}</span>
        </div>

        <div className="flex items-center gap-1.5" title={t("Database Status")}>
          <Database size={12} className={dbColorClass === 'text-success' ? 'text-emerald-500' : dbColorClass === 'text-danger' ? 'text-rose-500' : 'text-amber-500'} />
          <span className="hidden sm:inline">{t(dbText)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5" title={t("Language")}>
          <Globe size={12} className="text-zinc-500" />
          <span className="uppercase text-zinc-500">{lang}</span>
        </div>

        <div className={`flex items-center gap-1.5 ${capsLock ? 'text-amber-500 font-bold' : 'text-zinc-500'}`} title={t("Caps Lock Status")}>
          <Keyboard size={12} />
          <span className="hidden sm:inline">{capsLock ? 'CAPS ON' : 'CAPS OFF'}</span>
        </div>
      </div>
    </div>
  );
}
