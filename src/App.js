import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate} from 'react-router-dom';
import Characters from './Characters';
import CharacterProfile from './CharacterProfile';
import ProtectedRoute from "./ProtectedRoute";    
import SavedCharacters from "./SavedCharacters";      
import AccountProfile from './AccountProfile';
import { useAuth } from './AuthContext';          
import './App.css';
import axios from 'axios';

const formStyle = {
  padding: "40px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  maxWidth: "400px",
  margin: "50px auto",
  textAlign: "center",
};

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  margin: "10px 0",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "16px",
};

const buttonStyle = {
  maxWidth: "400px",
  padding: "12px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
};

const linkStyle = {
  color: "#007bff",
  textDecoration: "none",
};

// Login form
export function Login() {

  const { user, login } = useAuth(); // get login function from context
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');       
  const [error, setError] = useState('');                                        

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/characters'); // or your protected route
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Checking if a username and password is given
    if (username && password) {
      const result = await login({ username, password }); // Save user to context
      if (!result.success) {
        setError(result.message);
      }
    }
  };

  // Registration form to login using username and password
  return (
    <div style={formStyle}>
      <h2>Login</h2>
      
      {/* Show error message if present */}
      {error && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <Link to="/registration" style={linkStyle}>Register</Link>
      </p>
    </div>
  );
}

// Logout
export function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const hasRun = useRef(false); // persists across renders

  useEffect(() => {
    if (hasRun.current) return; // already ran
    hasRun.current = true;

    const handleLogout = async () => {
      await logout();
      navigate('/');
    };

    handleLogout();
  }, [logout, navigate]);


  return null;
}

export function Register() {

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // for redirecting after login         
                                  

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Checking if a username and password is given
    if (username && password && firstName && lastName && email && password === confirmPassword) {
      try {
        await axios.post('http://127.0.0.1:8000/register/', {
          username: username,
          password: password,
          firstname: firstName,
          lastname: lastName,
          email: email,
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        navigate('/');
      } catch (error) {
        console.error("Registration failed:", error.response?.data || error.message);
      }
    } 
    else if (password !== confirmPassword) {
      alert('Make sure both passwords are the same')
    }
    else {
      alert('Please fill in all required fields: Username, First Name, Password, Last Name, and Email.')
    }
  };

  // Returns the form to enter the registration details
  return (
    <div style={formStyle}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />
        <button type="submit" style={buttonStyle}>Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <Link to="/" style={linkStyle}>Login</Link>
      </p>
    </div>
  );
}

function App() {
  // Get user from local storage
  const { user } = useAuth();

  // The list of all the frontend routes
  return (
    <div>
      <nav className="nav-tabs">
        <Link to="/characters">All Characters</Link>
        <Link to="/user/characters">Saved Characters</Link>
        <Link to="/account">Account Profile</Link>
        {user && <Link to="/logout">Log out</Link>}
        {!user && <Link to="/">Login</Link>}
    
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/registration" element={<Register />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/user/characters" element={<ProtectedRoute><SavedCharacters /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountProfile /></ProtectedRoute>} />
        <Route path="/characters/:characterId" element={
        <ProtectedRoute>
          <CharacterProfile />
        </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
