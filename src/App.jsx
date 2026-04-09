import React, { useState, useEffect } from 'react';
import './App.css';

// --- CUSTOM HOOK: LA BÓVEDA (Persistencia Nativa) ---
function useVault(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn("Storage inaccesible, usando temporal:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn("Fallo guardando en bóveda:", error);
    }
  };
  return [storedValue, setValue];
}

const MOCK_CRYPTO = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', priceUsd: '68540.20', changePercent24Hr: '3.40' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', priceUsd: '3540.10', changePercent24Hr: '-1.20' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', priceUsd: '145.60', changePercent24Hr: '8.50' }
];

const App = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hook personalizado de la Bóveda Persistente
  const [vaultItems, setVaultItems] = useVault('miboveda-secreta', []);
  const [inputValue, setInputValue] = useState('');

  // Efecto de las Cripto
  useEffect(() => {
    setCryptoData(MOCK_CRYPTO);
    setLoading(false);
    const interval = setInterval(() => {
      setCryptoData(current => current.map(coin => {
        const volatility = (Math.random() - 0.5) * 50; 
        const newPrice = parseFloat(coin.priceUsd) + volatility;
        const newChange = parseFloat(coin.changePercent24Hr) + (Math.random() - 0.5);
        return {
          ...coin,
          priceUsd: newPrice.toFixed(2),
          changePercent24Hr: newChange.toFixed(2)
        };
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Lógica de Bóveda
  const addToVault = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newItem = { id: Date.now(), text: inputValue, completed: false };
    setVaultItems([...vaultItems, newItem]);
    setInputValue('');
  };

  const toggleVaultItem = (id) => {
    setVaultItems(vaultItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteVaultItem = (id) => {
    setVaultItems(vaultItems.filter(item => item.id !== id));
  };

  return (
    <div className="hq-container">
      {/* Columna Izquierda: Mercado */}
      <div className="todo-app panel-market">
        <h1>MERCADO ACTIVO 🔴</h1>
        {loading ? (
          <div style={{ textAlign: 'center' }}>Validando satélites...</div>
        ) : (
          <div className="task-list crypto-mini-grid">
            {cryptoData.map((crypto) => {
              const isPositive = parseFloat(crypto.changePercent24Hr) > 0;
              return (
                <div key={crypto.id} className={`crypto-card-hud ${isPositive ? 'glow-green' : 'glow-red'}`}>
                  <div className="card-left">
                    <h2>{crypto.name}</h2>
                    <span className="symbol-tx">{crypto.symbol}</span>
                  </div>
                  <div className="card-right">
                    <div className="price-tx">
                      ${parseFloat(crypto.priceUsd).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}
                    </div>
                    <div className={`change-tx ${isPositive ? 'pos' : 'neg'}`}>
                      {isPositive ? '+' : ''}{crypto.changePercent24Hr}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Columna Derecha: Bóveda Persistente */}
      <div className="todo-app panel-vault">
        <h1 className="gold-heading">🔒 BÓVEDA LOCAL</h1>
        <p className="vault-description">Tus notas estratégicas están codificadas y guardadas permanentemente en tu disco duro.</p>
        
        <form onSubmit={addToVault} className="vault-form">
          <input
            type="text"
            className="vault-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ej: Comprar 2 Ethereum mañana..."
          />
          <button type="submit" className="vault-btn">Sellar</button>
        </form>

        <ul className="task-list vault-list">
          {vaultItems.map(item => (
            <li key={item.id} className={item.completed ? 'completed vault-item' : 'vault-item'}>
              <span onClick={() => toggleVaultItem(item.id)} className="vault-text">
                {item.text}
              </span>
              <button className="delete-btn vault-delete" onClick={() => deleteVaultItem(item.id)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </li>
          ))}
          {vaultItems.length === 0 && (
            <div className="empty-vault">La bóveda está vacía. Añade datos vitales.</div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default App;