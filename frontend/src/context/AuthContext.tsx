import { createContext, ReactNode, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  userType?: 'admin' | 'partner';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  loginPartner: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPartner: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    console.log('Login called with:', email);
  };

  const loginAdmin = async (email: string, password: string) => {
    console.log('Admin login called with:', email);
  };

  const loginPartner = async (email: string, password: string) => {
    console.log('Partner login called with:', email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const contextValue: AuthContextType = {
    user,
    login,
    loginAdmin,
    loginPartner,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isPartner: user?.role === 'partner',
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
