import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000'; // Local backend URL

function Login({ setToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('vendor');
    const navigate = useNavigate(); // React Router hook for navigation

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            console.log('Login response:', res.data); // Debug response
            const token = res.data.token;
            if (token) {
                localStorage.setItem('token', token);
                setToken(token);
                console.log('Token set, redirecting to:', role === 'vendor' ? '/vendor' : '/delivery'); // Debug redirect
                navigate(role === 'vendor' ? '/vendor' : '/delivery'); // Use navigate instead of window.location
            } else {
                console.error('No token in response');
                alert('Login failed: No token received');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message); // Debug error
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <h1>ONDC Vendor Management</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="vendor">Vendor</option>
                    <option value="delivery">Delivery</option>
                </select>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;