import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:3007/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Login successful');


                navigate('/dashboard');
            } else {
                setError(data.error || 'Login failed. Please try again');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An error occurred while trying to log in. Please try again.');
        }
    };

    return (
        <div className="max-h-max flex justify-center items-center min-h-screen rounded-lg">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-green-500">Login</h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <span>Don't have an account? </span>
                        <a href="#register" className='text-green-500' onClick={()=>navigate('/register')}>Register</a>
                    </div>
                    <div>
                        <input type="checkbox" className="mr-2" />
                        <span>Remember me</span>
                    </div>
                    <div>
                        <a href="#" className="text-green-500">Forgot password?</a>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
                        >
                            Login
                        </button>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;
