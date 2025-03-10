import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Replace with your Railway URL after deployment

function Login({ setToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('vendor');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            window.location.href = role === 'vendor' ? '/vendor' : '/delivery';
        } catch (error) {
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