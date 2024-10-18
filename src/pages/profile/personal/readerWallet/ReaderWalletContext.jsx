import { createContext, useState } from 'react';

export const ReaderWalletContext = createContext({
  refetchWalletAndTable: false,
  setRefetchWalletAndTable: () => {},
});

export const ReaderWalletContextProvider = ({ children }) => {
  const [refetchWalletAndTable, setRefetchWalletAndTable] = useState(false);

  return (
    <ReaderWalletContext.Provider value={{ refetchWalletAndTable, setRefetchWalletAndTable }}>
      {children}
    </ReaderWalletContext.Provider>
  );
};
