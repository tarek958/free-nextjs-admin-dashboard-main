// contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
}

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

const getUserIdFromToken = (token: string): string | null => {
  try {
    const decodedToken: { id: string } = jwtDecode(token);
    return decodedToken.id;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const userId = getUserIdFromToken(token);
        if (userId) {
          try {
            const config = {
              headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(`http://localhost:5000/api/users/${userId}`, config);
            setUser(response.data);
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
            localStorage.removeItem('token'); 
            window.location.href = '/auth/signin'; 
          }
        } else {
          setUser(null);
          localStorage.removeItem('token'); 
          window.location.href = '/auth/signin'; 
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
