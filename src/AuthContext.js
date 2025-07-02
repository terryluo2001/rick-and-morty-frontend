// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null means not logged in
  const navigate = useNavigate(); // for redirecting after login
  // Restore user from localStorage on page load
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username) => {
    try {
      
      // Calls the login backend using the username and password
      const response = await axios.post(`http://${process.env.REACT_APP_API_URL}/login/`, {
        userData: username
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Successful login meaning account is available and correct username and password
      if (response.data.message === 'Login successful') {

        setUser(username);
        sessionStorage.setItem("user", JSON.stringify(username));
        sessionStorage.setItem("session_id", JSON.stringify(response.data.session_id));
        navigate('/characters'); // redirect to a protected route
        return { success: true, message: 'Login successful' };
      }

      // Correct username and password but unavailable account
      else if (response.data.message === 'Account unavailable') {
        return { success: false, message: 'Account unavailable' };

      // Incorrect username and password
      } else {
        return { success: false, message: response.data.message };
      }
    }
    catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  const logout = async () => {
    await axios.post(`http://${process.env.REACT_APP_API_URL}/logout/`, {
      session_id: sessionStorage.getItem("session_id")
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });                             
    // Resets the user to null and clears the session storage
    setUser(null);
    sessionStorage.removeItem("user");  
    navigate('/');      // redirect to homepage
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}