import { createContext, useState } from 'react';

export const ProfileServiceContext = createContext({
  loading: false,
  setLoading: () => {},
});

export const ProfileServiceContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <ProfileServiceContext.Provider value={{ loading, setLoading }}>
      {children}
    </ProfileServiceContext.Provider>
  );
};
