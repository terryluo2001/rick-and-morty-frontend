import { useEffect, useState } from 'react';
import axios from 'axios';

// Used to fetch the list of characters
function AccountProfile() {
    const [accountDetails, setAccountDetails] = useState(null);
    const storedUser = JSON.parse(localStorage.getItem("user"));

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

    // Updating the information
    const handleUpdateProfile = async () => {

        if (!formData.firstname || !formData.lastname || !formData.email) {
            alert('Please fill in all required fields: First Name, Last Name, and Email.');
            return;
        }
        // Prepare update data
        const updateData = {
            username: storedUser.username,
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
        };
        try {
            // Call backend API to update user info (example URL)
            await axios.post('http://127.0.0.1:8000/update_profile/', updateData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Update UI state locally after successful update
            setAccountDetails(prev => ({
            ...prev,
            ...updateData
            }));

            alert('Profile updated successfully');
        } catch (error) {
            console.error('Update failed:', error.response?.data || error.message);
            alert('Failed to update profile.');
        }
    };

    // Updating the information
    const handleUpdatePassword = async () => {

        if (!formData.password || !formData.confirmPassword) {
            alert('Please enter a password');
            return;
        }

        if (formData.password || formData.confirmPassword) {
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match.");
                return;
            }
        }

        // Prepare update data
        const updatePassword = {
            username: storedUser.username,
            password: formData.password
        };

        try {
            // Call backend API to update user info (example URL)
            await axios.post('http://127.0.0.1:8000/update_password/', updatePassword, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('Password updated successfully');
        } catch (error) {
            console.error('Failed to update password:', error.response?.data || error.message);
            alert('Failed to update password.');
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

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}><strong>First Name:</strong></label>
                    <input
                    type="text"
                    value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}><strong>Last Name:</strong></label>
                    <input
                    type="text"
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}><strong>Email:</strong></label>
                    <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={inputStyle}
                    />
                </div>

                <button onClick={handleUpdateProfile} style={buttonStyle}>
                    Update
                </button>

                {/* Updating the new password */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>
                        <strong>New password:</strong>
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={inputStyle}
                    />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>
                        <strong>Confirm new password:</strong>
                    </label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        style={inputStyle}
                    />
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
