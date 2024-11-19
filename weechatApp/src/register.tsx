import React, { useEffect, useState } from 'react';
import { MdOutlineMail } from "react-icons/md";
import { IoMdEyeOff } from "react-icons/io";
import { BsPersonSquare } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { CgPassword } from 'react-icons/cg';

const Register: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        Username: '',
        password: '',
        confirmPassword: '',
        languagePreference: ''
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const [languages, setLanguages] = useState<{ code: string, name: string }[]>([]);
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await fetch('http://localhost:3007/api/languages');
                const data = await response.json();
                setLanguages(data)
            } catch (error) {
                alert("Failed to connect to the server");
                console.error(error);
            }
        };
        fetchLanguages();
    },
        []);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const response = await fetch('http://localhost:3007/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Registration successful");
                navigate('/login');
            } else {
                alert(data.error || "An error occurred");
                console.error(data.error);
            }
            if(formData.password.length < 8) {
                alert("Password must contain at least 8 characters");
            }
        } catch (error) {
            alert("Failed to connect to the server");
            console.error(error);
        }
    };
    return (
        <div className='max-h-max flex justify-center items-center min-h-screen rounded-lg w-full tablet:flex-row'>
            <div className='bg-white p-8 rounded-2xl shadow-md w-full max-w-md'>
                <h1 className='text-2xl font-bold mb-6 text-center text-green-500'>Register</h1>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <div className='relative flex items-center'>
                        <MdOutlineMail className='absolute left-3 text-gray-500 text-2xl' />
                        <input
                            type="text"
                            required
                            name="email"
                            placeholder="Email"
                            className='w-full px-4 py-2 pl-14 border border-gray-300 rounded-md'
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex relative items-center '>
                        <BsPersonSquare className='text-gray-500 ml-3 text-2xl absolute' />
                        <input
                            required
                            type="text"
                            name="Username"
                            placeholder="Username"
                            value={formData.Username}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-md pl-14'
                        />
                    </div>
                    <div className="flex relative items-center border border-gray-300 rounded-md">
                        <IoMdEyeOff className="text-gray-500 ml-3 text-2xl absolute" />
                        <input
                            type="password"
                            required
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-md pl-14'
                        />
                    </div>
                    <div className="flex relative items-center border border-gray-300 rounded-md">
                        <IoMdEyeOff className="text-gray-500 ml-3 text-2xl absolute" />
                        <input
                            required
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-md pl-14'
                        />
                    </div>
                    <br />
                    <br />
                    <div>
                        <label htmlFor=" preferredLanguage">Preferred Language:</label>
                        <select
                            name="languagePreference"
                            value={formData.languagePreference}
                            onChange={handleChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-md'
                        >
                            <option value="">Select Language</option>
                            {languages.map((language) => (
                                <option key={language.code} value={language.code}>
                                    {language.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <span>Already have an account? </span>
                        <a href="#login" className='text-green-500' onClick={() => navigate('/login')}>Login</a>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            className='mr-2'
                        />
                        <span>Remember me</span>
                    </div>
                    <div>
                        <a href="#" className='text-green-500'>Forgot password?</a>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300'
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
