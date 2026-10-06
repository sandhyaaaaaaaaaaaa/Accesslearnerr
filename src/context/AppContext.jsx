import { createContext, useContext, useState, useCallback } from 'react';
import { DEFAULT_LEARNER_PROFILE } from '../utils/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const register = useCallback((userData) => {
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [learnerProfile, setLearnerProfile] = useState(DEFAULT_LEARNER_PROFILE);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [a11ySettings, setA11ySettings] = useState({
    highContrast: false,
    fontSize: 'medium',
    reducedMotion: false,
  });

  const updateProfile = useCallback((updates) => {
    setLearnerProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateA11y = useCallback((updates) => {
    setA11ySettings((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        learnerProfile,
        updateProfile,
        currentDocument,
        setCurrentDocument,
        uploadedFiles,
        setUploadedFiles,
        a11ySettings,
        updateA11y,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
