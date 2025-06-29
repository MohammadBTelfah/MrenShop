import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({
    username: '',
    email: '',
    fullName: '',
    address: '',
    phone: '',
    role: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5003/api/users/getallusers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        navigate('/login');
      }
    };
    fetchUsers();
  }, [navigate]);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setUpdatedUser({
      username: user.username || '',
      email: user.email || '',
      fullName: user.fullName || '',
      address: user.address || '',
      phone: user.phone || '',
      role: user.role || 'user'
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://127.0.0.1:5003/api/users/update/${selectedUser._id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setUsers(prev =>
        prev.map(u => (u._id === selectedUser._id ? { ...u, ...updatedUser } : u))
      );
      alert("User updated successfully");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://127.0.0.1:5003/api/users/deleteUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setUsers(prev => prev.filter(u => u._id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <div>
      <h1>Users</h1>
      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Username</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Email</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Full Name</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Address</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Phone</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Role</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Update</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.username}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.email}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.fullName}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.address}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.phone}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.role}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                  <Button variant="contained" color="warning" onClick={() => handleOpenModal(user)}>
                    Update
                  </Button>
                </td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                  <Button variant="contained" color="error" onClick={() => handleDeleteUser(user._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      {/* Modal for Update */}
      {openModal && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300
          }}
        >
          <Box
            sx={{
              bgcolor: 'background.paper',
              p: 4,
              borderRadius: 2,
              minWidth: 300,
              boxShadow: 24
            }}
          >
            <Typography variant="h6" mb={2}>Update User</Typography>
            <form onSubmit={handleUpdateSubmit}>
              {["username", "email", "fullName", "address", "phone", "role"].map(field => (
                <Box key={field} mb={2}>
                  <label style={{ display: 'block', fontWeight: 'bold' }}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={updatedUser[field]}
                    onChange={handleUpdateChange}
                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                    required
                  />
                </Box>
              ))}
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      )}
    </div>
  );
}
