import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState<{Username: string }[]>([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3007/api/users');
                const data = await response.json();
                setUsers(data)
            } catch (error) {
                alert("Failed to connect to the server");
                console.error(error);
            }
        };
        fetchUsers();
    },
        []);

    return (
        <div>
            <h1 className='text'>Dashboard</h1>
            <button onClick={() => navigate('/register')}>Register</button>
            <button onClick={() => navigate('/login')}>Login</button>
            <ul>
                {users.map((user) => (
                    <li key={user.Username}>{user.Username}</li>
                ))}
            </ul>
        </div>
    );
}
export default Dashboard;