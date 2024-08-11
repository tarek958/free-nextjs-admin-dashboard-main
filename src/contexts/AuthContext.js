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
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/auth/signin'); // Redirect to login if no token
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://148.113.194.169:5000/check', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.authenticated) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token'); // Remove token if not authenticated
          router.push('/auth/signin');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('token'); // Remove token on error
        router.push('/auth/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);
