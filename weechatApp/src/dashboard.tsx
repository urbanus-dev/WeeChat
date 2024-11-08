import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState<{ Username: string }[]>([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3007/api/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                alert("Failed to connect to the server");
                console.error(error);
            }
        };
        fetchUsers();
    }, []);

    const loggedInUser = localStorage.getItem('user');
    const parsedUser = loggedInUser ? JSON.parse(loggedInUser) : null;

    if (!parsedUser) {
        navigate('/login');
        return null;
    }

    const filteredUsers = users.filter((user) => user.Username !== parsedUser.Username);

    const welcomeMessage = filteredUsers.length
        ? `Welcome ${parsedUser.Username}. You have ${filteredUsers.length} friends online`
        : 'Welcome, you have no friends online';

    return (
        <div className="flex flex-col min-h-screen tablet:flex-row">
            <aside className="w-full tablet:w-1/4 bg-gray-200 p-4">
                <h2 className="text-xl font-bold mb-4">Friends</h2>
                <ul className="space-y-2">
                    {filteredUsers.map((user) => (
                        <li key={user.Username} className="bg-white p-4 rounded-md shadow-md flex gap-3">
                            <div className="h-10 w-10 bg-blue-950 rounded-full flex items-center justify-center">
                                <span className='text-white text-3xl font-bold'>{user.Username[0]}</span>
                            </div>
                            <div className='flex mt-2'>
                                {user.Username}
                            </div>
                        </li>
                    ))}
                </ul>
            </aside>
            <div className="flex-grow flex flex-col">
                <nav className="flex items-center bg-green-600 w-full h-16 p-4 gap-4">
                    <div className="h-10 w-10 bg-blue-950 rounded-full flex items-center justify-center">
                        <span className="text-white text-3xl">{parsedUser.Username[0]}</span>
                    </div>
                    <h2 className="text-white text-xl">{welcomeMessage}</h2>
                    <button
                        onClick={() => {
                            localStorage.removeItem('user');
                            navigate('/');
                        }}
                        className="ml-auto bg-white text-blue-950 py-2 px-4 rounded-md hover:bg-orange-500 transition duration-300"
                    >
                        Logout
                    </button>
                </nav>

                <main className="flex-grow p-8">
                </main>
            </div>
        </div>
    );
}

export default Dashboard;