import { useState, useEffect } from 'react';
import { Database, Wifi, WifiOff, Keyboard, Globe } from 'lucide-react';
import api from '../../api/api';

export default function StatusBar() {
  const [network, setNetwork] = useState(navigator.onLine);
  const [dbState, setDbState] = useState(null);
  const [capsLock, setCapsLock] = useState(false);
  const [lang] = useState(navigator.language);

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
        const res = await api.get('/status');
        setDbState(res.data.dbState);
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
    <div className="fixed-bottom bg-dark text-light border-top border-secondary d-flex justify-content-between px-3 py-1" style={{ fontSize: '0.75rem', zIndex: 1050 }}>
      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-1" title={network ? "Online" : "Offline"}>
          {network ? <Wifi size={12} className="text-success" /> : <WifiOff size={12} className="text-danger" />}
          <span>{network ? 'Online' : 'Offline'}</span>
        </div>

        <div className="d-flex align-items-center gap-1" title="Database Status">
          <Database size={12} className={dbColorClass} />
          <span>{dbText}</span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-1" title="Browser Language">
          <Globe size={12} className="text-secondary" />
          <span className="text-uppercase text-secondary">{lang.split('-')[0]}</span>
        </div>

        <div className={`d-flex align-items-center gap-1 ${capsLock ? 'text-warning fw-bold' : 'text-secondary'}`} title="Caps Lock Status">
          <Keyboard size={12} />
          <span>{capsLock ? 'CAPS ON' : 'CAPS OFF'}</span>
        </div>
      </div>
    </div>
  );
}
