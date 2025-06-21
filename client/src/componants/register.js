//  create a reg componant that contain these fields username, email, password, fullName, address, phone 
//  after we catch the username, email, password, fullName, address, phone  we will send them to the api to register the user
//  http://127.0.0.1:5003/api/users/register
import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [userDate , setUserDate] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        address: '',
        phone: ''
    });

    return(
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            <form onSubmit={async (e) => {
                e.preventDefault();
               try {
                const res = await axios.post("http://127.0.0.1:5003/api/users/register", userDate);
                console.log("Registration successful:", res.data);
                // Redirect to login or dashboard after successful registration
                // For example, using useNavigate from react-router-dom
                navigate('/login'); // Adjust the path as needed
               } catch (error) {
                    console.error("Error during registration:", error);
                }

            } }>
                <input type="text" placeholder='Username' value={userDate.username} onChange={(e) => setUserDate({...userDate, username: e.target.value})} />
                <input type="email" placeholder='Email' value={userDate.email} onChange={(e) => setUserDate({...userDate, email: e.target.value})} />
                <input type="password" placeholder='Password' value={userDate.password} onChange={(e) => setUserDate({...userDate, password: e.target.value})} />
                <input type="text" placeholder='Full Name' value={userDate.fullName} onChange={(e) => setUserDate({...userDate, fullName: e.target.value})} />
                <input type="text" placeholder='Address' value={userDate.address} onChange={(e) => setUserDate({...userDate, address: e.target.value})} />
                <input type="text" placeholder='Phone' value={userDate.phone} onChange={(e) => setUserDate({...userDate, phone: e.target.value})} />
                <input type="submit" value="Register" />
            </form>
        </Box>
    )
}