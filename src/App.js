import React, { useState, useEffect, useRef } from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
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
  const [visible, setVisible] = useState(false);
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
      console.log(result);
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
        {/*Username input box */}
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
        
        {/*Password input box*/}
        <div style={{ position: 'relative' }}>
          <input
            type={visible ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              ... inputStyle,
              paddingRight: '15px' // ensures input text doesn't overlap icon
            }}
          />
          <div
            onClick={() => setVisible(!visible)}
            style={{
              position: 'absolute',
              top: '50%',
              right: '-25px',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#888'
            }}
          >
            {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </div>
        </div>
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

// Register page
export function Register() {
  console.log(`${process.env.REACT_APP_API_URL}`)
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState(true);
  const [errors, setErrors] = useState({}); // Error state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Error for putting the dictionary, configured
    const newErrors = {};
    if (!firstName) newErrors.firstName = 'First name required';
    if (!lastName) newErrors.lastName = 'Last name required';
    if (!username) newErrors.username = 'Username required';
    if (!email) newErrors.email = 'Email required';
    if (!password) newErrors.password = 'Password required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // If successfully registered then navigate to the login page
    try {
      await axios.post(`http://${process.env.REACT_APP_API_URL}/register/`, {
        username,
        password,
        firstname: firstName,
        lastname: lastName,
        email
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert("You have successfully registered.")
      navigate('/');
    } catch (error) {
      const errMsg = error.response?.data?.errors;
      if (errMsg) {
        const newErrors = {};
        if ('username' in errMsg) newErrors.username = 'Username is taken';
        if ('email' in errMsg) newErrors.email = 'Email is taken';
        setErrors(prev => ({ ...prev, ...newErrors }));
      }
    }
  };

  return (
    <div style={formStyle}>
      <h2>Register</h2>

      {/*Form to handle registration detail submissions*/}
      <form onSubmit={handleSubmit}>
        <InputField
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          error={errors.firstName}
        />
        <InputField
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          error={errors.lastName}
        />
        <InputField
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          error={errors.username}
        />
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={errors.email}
        /> 
        <div style={{ position: 'relative' }}>
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={errors.password}
          />

          {/*Ability to show and hide password */}
          <div
              onClick={() => setVisible(!visible)}
              style={{
              position: 'absolute',
              top: '50%',
              right: '-10px',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#888'
              }}
          >
              {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <InputField
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />

          {/**Ability to show and hide password */}
          <div
              onClick={() => setVisible(!visible)}
              style={{
              position: 'absolute',
              top: '50%',
              right: '-10px',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#888'
              }}
          >
              {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </div>
        </div>
        <button type="submit" style={buttonStyle}>Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <Link to="/" style={linkStyle}>Login</Link>
      </p>
    </div>
  );
}

// 🔧 Reusable input component with error label
function InputField({ type, placeholder, value, onChange, error }) {
  return (
    <div style={{ marginBottom: '15px' }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          ...inputStyle,
          borderColor: error ? 'red' : '#ccc'
        }}
      />
      {error && <div style={{ color: 'red', fontSize: '0.8em', marginTop: '4px' }}>{error}</div>}
    </div>
  );
}

function App() {
  // Get user from local storage
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(null);

  // Getting the details of the user
  useEffect(() => {
    if (!user) {
      setFirstName(null);
      return
    }
    axios.get(`http://${process.env.REACT_APP_API_URL}/details/`, {headers: {'username': user.username}})
        .then(response => {
            const data = response.data.message;
            setFirstName(data[2]);
        })
        .catch(error => {
            console.error('Error fetching characters:', error);
        });
  }, [user]);

  // The list of all the frontend routes
  return (
      <>
      {firstName && (
        <div style={{
          position: 'fixed',
          top: 10,
          right: 10,
          padding: '8px 12px',
          borderRadius: 5,
          fontWeight: 'bold',
          zIndex: 9999
        }}>
      Hello, {firstName}
    </div>
      )}
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
    </>
  );
}

export default App;