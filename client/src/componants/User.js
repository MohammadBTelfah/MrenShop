import  { useEffect, useState } from 'react';
import axios from 'axios';
export default function Users() {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5003/api/users/getallusers");
                console.log("Users fetched:", response.data);
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                // Optionally, you can redirect to login or show an error message
            }
        };
        fetchUsers();
    }, []);
    
    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        {user.name} - {user.email} - {user.role}
                    </li>
                ))}
            </ul>
        </div>
    );
}