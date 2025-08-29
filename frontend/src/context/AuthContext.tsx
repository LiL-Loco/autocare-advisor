import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

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

const API_BASE_URL = 'http://localhost:5001/api';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored auth token on mount - Client-side only
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    console.log('AuthContext useEffect - checking stored auth');
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    console.log('Stored token exists:', !!storedToken);
    console.log('Stored user exists:', !!storedUser);

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Parsed user data:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
    console.log('AuthContext loading set to false');
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { tokens, user: userData } = await response.json();

      // Store in localStorage for client-side usage
      localStorage.setItem('authToken', tokens.accessToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Set HTTP-only cookie for middleware
      document.cookie = `authToken=${tokens.accessToken}; path=/; max-age=86400; SameSite=strict`;

      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Admin login failed');
      }

      const { tokens, user: userData } = await response.json();

      // Store in localStorage for client-side usage
      localStorage.setItem('authToken', tokens.accessToken);
      localStorage.setItem(
        'user',
        JSON.stringify({ ...userData, userType: 'admin' })
      );

      // Set HTTP-only cookie for middleware
      document.cookie = `authToken=${tokens.accessToken}; path=/; max-age=86400; SameSite=strict`;

      setUser({ ...userData, userType: 'admin' });
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginPartner = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/partner/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Partner login failed');
      }

      const { tokens, user: userData } = await response.json();

      // Store in localStorage for client-side usage
      localStorage.setItem('authToken', tokens.accessToken);
      localStorage.setItem(
        'user',
        JSON.stringify({ ...userData, userType: 'partner' })
      );

      // Set HTTP-only cookie for middleware
      document.cookie = `authToken=${tokens.accessToken}; path=/; max-age=86400; SameSite=strict`;

      setUser({ ...userData, userType: 'partner' });
    } catch (error) {
      console.error('Partner login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Clear cookie
    document.cookie =
      'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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
    isPartner: user?.role === 'partner' || user?.userType === 'partner',
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
