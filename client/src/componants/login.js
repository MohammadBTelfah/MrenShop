//  create a reg componant that contain these fields username, email, password, fullName, address, phone 
//  after we catch the username, email, password, fullName, address, phone  we will send them to the api to register the user
//  http://127.0.0.1:5003/api/users/register
import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [userDate , setUserDate] = useState({
        email: '',
        password: '',
      
    });

    return(
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <form onSubmit={async (e) => {
                e.preventDefault();
               try {
                const res = await axios.post("http://127.0.0.1:5003/api/users/login", userDate);
                console.log("Login successful:", res.data);
                // Redirect to login or dashboard after successful registration
                // For example, using useNavigate from react-router-dom
                localStorage.setItem('token', res.data.token); // Store the token in localStorage
                navigate('/'); // Adjust the path as needed
                
                
               } catch (error) {
                    console.error("Error during registration:", error);
                }
                
               
            } }>
                <input type="email" placeholder='Email' value={userDate.email} onChange={(e) => setUserDate({...userDate, email: e.target.value})} />
                <input type="password" placeholder='Password' value={userDate.password} onChange={(e) => setUserDate({...userDate, password: e.target.value})} />
                                <input type="submit" value="Login" />
            </form>
        </Box>
    )
}