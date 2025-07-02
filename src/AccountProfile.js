import { useEffect, useState } from 'react';
import axios from 'axios';

// Used to fetch the list of characters
function AccountProfile() {
    const [accountDetails, setAccountDetails] = useState(null);
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const [errors, setErrors] = useState({});

    // Form data for the things we can choose   
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Making sure the user know what their first name, last name and email are
    useEffect(() => {
        if (accountDetails) {
            setFormData({
            firstname: accountDetails.firstname || '',
            lastname: accountDetails.lastname || '',
            email: accountDetails.email || '',
            password: '',
            confirmPassword: ''
            });
        }
    }, [accountDetails]);

    // Getting the details of the user
    useEffect(() => {
    axios.get('http://127.0.0.1:8000/details/', {headers: {'username': storedUser.username}})
        .then(response => {
            const data = response.data.message;
            console.log(data);
            const userObj = {
                username: data[1],
                firstname: data[2],
                lastname: data[3],
                email: data[5]
            };
            console.log(userObj);
            setAccountDetails(userObj);
        })
        .catch(error => {
            console.error('Error fetching characters:', error);
        });
    }, []);

    // Updating the first name, last name and email
    const handleUpdateProfile = async () => {
        const newErrors = {};

        if (!formData.firstname) newErrors.firstname = 'First name is required';
        if (!formData.lastname) newErrors.lastname = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const updateData = {
            username: storedUser.username,
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
        };

        try {
            await axios.post('http://127.0.0.1:8000/update_profile/', updateData, {
            headers: { 'Content-Type': 'application/json' }
            });

            setAccountDetails(prev => ({ ...prev, ...updateData }));
            setErrors({});
            alert('Profile updated successfully');
        } catch (error) {
            const errMsg = error.response?.data?.errors;
            if (errMsg) {
                const newErrors = {};
                if ('email' in errMsg) newErrors.email = 'Email is taken';
                setErrors(prev => ({ ...prev, ...newErrors }));
            }
        }
    };


    // Updating the password
    const handleUpdatePassword = async () => {
        const newErrors = {};

        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
        if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...newErrors }));
            return;
        }

        const updatePassword = {
            username: storedUser.username,
            password: formData.password
        };

        try {
            await axios.post('http://127.0.0.1:8000/update_password/', updatePassword, {
            headers: { 'Content-Type': 'application/json' }
            });

            setErrors({});
            alert('Password updated successfully');
        } catch (error) {
            const errData = error.response?.data?.errors || {};
            setErrors(prev => ({ ...prev, ...errData }));
            console.error('Failed to update password:', errData || error.message);
        }
    };


    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Profile Information</h1>

            { /* The profile information including the details we can change (first name, last name and email address) */}
            {accountDetails ? (
            <div style={{ maxWidth: '400px', margin: '0 auto'}}>
                <div style={{ marginBottom: '15px' }}>
                    <label><strong>Username:</strong></label>
                    <div style={{ padding: '8px 0' }}>{accountDetails.username}</div>
                </div>

                {/*Form to fill out first name*/}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>
                        <strong>First Name:</strong>
                    </label>
                    <input
                        type="text"
                        value={formData.firstname}
                        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                        style={{
                        ...inputStyle,
                        borderColor: errors.firstname ? 'red' : '#ccc'
                        }}
                    />
                    {errors.firstname && (
                        <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.firstname}</div>
                    )}
                </div>

                {/*Form to fill out last name*/}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>
                        <strong>Last Name:</strong>
                    </label>
                    <input
                        type="text"
                        value={formData.lastname}
                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                        style={{
                        ...inputStyle,
                        borderColor: errors.lastname ? 'red' : '#ccc'
                        }}
                    />
                    {errors.lastname && (
                        <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.lastname}</div>
                    )}
                </div>
                
                {/*Form to fill out email*/}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>
                        <strong>Email:</strong>
                    </label>
                    <input
                        type="text"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                            ...inputStyle,
                            borderColor: errors.email ? 'red' : '#ccc'
                        }}
                    />
                    {errors.email && (
                        <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.email}</div>
                    )}
                </div>
                
                <button onClick={handleUpdateProfile} style={buttonStyle}>
                    Update
                </button>

                {/* Updating the new password */}
                <div style={{ marginBottom: '15px' }}>

                    {/*Form to fill out password*/}
                    <label style={{ display: 'block', marginBottom: '8px' }}>
                        <strong>New password:</strong>
                    </label>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>
                            <strong>Password</strong>
                        </label>
                        <input
                            type="text"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{
                            ...inputStyle,
                            borderColor: errors.password ? 'red' : '#ccc'
                            }}
                        />
                        {errors.password && (
                            <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.firstname}</div>
                        )}
                    </div>
                    
                    {/*Form to confirm password */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>
                            <strong>Confirm New Password:</strong>
                        </label>
                        <input
                            type="text"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            style={{
                            ...inputStyle,
                            borderColor: errors.confirmPassword ? 'red' : '#ccc'
                            }}
                        />
                        {errors.confirmPassword && (
                            <div style={{ color: 'red', fontSize: '0.8em' }}>{errors.confirmPassword}</div>
                        )}
                    </div>
                </div>
                <button onClick={handleUpdatePassword} style={buttonStyle}>
                    Change Password
                </button>
            </div>
            ) : (
            <p>Loading...</p>
            )}
        </div>
    );
}

const inputStyle = {
  width: "100%",
  padding: "8px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  padding: "10px 16px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
  marginBottom: '35px'
};

export default AccountProfile;
