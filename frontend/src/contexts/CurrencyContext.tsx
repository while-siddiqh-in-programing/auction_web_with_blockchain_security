import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  currency: 'USD' | 'INR';
  setCurrency: (currency: 'USD' | 'INR') => void;
  formatAmount: (amount: number) => string;
  convertAmount: (amount: number, fromCurrency?: 'USD' | 'INR') => number;
  getSymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currency, setCurrency] = useState<'USD' | 'INR'>('INR');

  // Exchange rate: 1 USD = 85 INR (you can make this dynamic later)
  const USD_TO_INR_RATE = 85;

  // Load saved currency preference
  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency') as 'USD' | 'INR';
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const handleSetCurrency = (newCurrency: 'USD' | 'INR') => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const convertAmount = (amount: number, fromCurrency: 'USD' | 'INR' = 'USD') => {
    if (fromCurrency === currency) {
      return amount; // No conversion needed
    }

    if (fromCurrency === 'USD' && currency === 'INR') {
      return Math.round(amount * USD_TO_INR_RATE);
    } else if (fromCurrency === 'INR' && currency === 'USD') {
      return Math.round((amount / USD_TO_INR_RATE) * 100) / 100; // Round to 2 decimal places
    }

    return amount;
  };

  const formatAmount = (amount: number) => {
    const convertedAmount = convertAmount(amount, 'USD'); // Assume base amounts are in USD
    return convertedAmount?.toLocaleString?.() ?? '0';
  };

  const getSymbol = () => {
    return currency === 'INR' ? '₹' : '$';
  };

  const value = {
    currency,
    setCurrency: handleSetCurrency,
    formatAmount,
    convertAmount,
    getSymbol,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};