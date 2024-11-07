import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//i need to get all the users from the database
const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState<{ id: number, email: string, Username: string, password: string, languagePreference: string }[]>([]);
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
            <h1>Users</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Language Preference</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.Username}</td>
                            <td>{user.password}</td>
                            <td>{user.languagePreference}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default Dashboard;
