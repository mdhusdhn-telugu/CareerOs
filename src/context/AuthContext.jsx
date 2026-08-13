import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '/src/firebase/firebaseConfig.js'; // Using absolute path from root

const AuthContext = createContext({
    user: null, 
    loading: true, 
    logout: () => new Promise((resolve) => resolve()), // Dummy function
});
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define the logout function
  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Create the value object to pass to the provider
  const value = {
    user,
    loading,
    logout, // Add the logout function here
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

