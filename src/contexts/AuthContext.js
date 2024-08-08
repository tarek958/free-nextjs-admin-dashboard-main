import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

// Create a Context for Auth
const AuthContext = createContext();

// Provide the Context to children
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on load
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/session');
        if (response.data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push('/login'); // Redirect to login page
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.push('/login'); // Redirect to login page
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // You can customize this loading state
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);
