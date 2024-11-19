import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export const UpdateProfile: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [Username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [languagePreference, setLanguagePreference] = useState('');
    const [parsedUser, setParsedUser] = useState<{ Username: string, id: number, languagePreference: string } | null>(null);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setParsedUser(JSON.parse(loggedInUser));
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleUpdateProfile = async () => {
        if (!email || !Username || !password || !languagePreference) return;

        try {
            const response = await fetch(`http://localhost:3007/api/users/updateUser/${parsedUser?.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, Username, password, languagePreference }),
            });
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div>
            <h1>Update Profile</h1>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
                Username:
                <input type="text" value={Username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label>
                Language Preference:
                <input type="text" value={languagePreference} onChange={(e) => setLanguagePreference(e.target.value)} />
            </label>
            <button onClick={handleUpdateProfile}>Update Profile</button>
        </div>
    );
}
