import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from './FormInput';
import axios from "axios"
import '../styles/styles.css';

function LoginSignupForm({ isSignup = false }) {
    const [formData, setFormData] = useState({
        username: '',
        email: isSignup ? '' : undefined,
        password: '',
        role: isSignup ? '' : undefined,
    });
    const [isNightMode, setIsNightMode] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const axiosLogin = async() => {
        const postData = {
            username: formData.username,
            password: formData.password
        }

        const response = await axios.post('http://localhost:4000/user/login', postData)
        return response.data
    }

    const axiosSignUp = async() => {
        const postData = {
            username: formData.username,
            email:formData.email,
            password: formData.password,
            role:formData.role
        }

        const response = await axios.post('http://localhost:4000/signup', postData)
        return response.data
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isSignup) {
            axiosLogin()
            .then(res => {
                if (res['status'] === false) {
                    alert('Invalid credentials!');
                } else if (res['status'] === true) {
                    if (res['userType'] === 'PLAYER')  navigate('/player', {state:{username:formData.username}});
                    else if (res['userType'] === 'DESIGNER') navigate('/designer', {state:{username:formData.username}});
                }
            })
        } else {
            if (!formData.role) alert('Please select a role.');
            axiosSignUp()
            .then(res => {
                if (res['status'] === false) {
                    alert('This username has already been taken.');
                } else if (res['status'] === true) {
                    let state =  {
                        state:{username:formData.username,
                        id:res['id']}}
                    if (formData.role === 'Player')  navigate('/player', state);
                    else if (formData.role === 'Designer') navigate('/designer', state);
                }
            })
        }
    };

    const toggleNightMode = () => {
        setIsNightMode(!isNightMode);
        document.body.classList.toggle('night-mode', !isNightMode);
    };

    return (
        <div className={`container ${isNightMode ? 'night-mode' : ''}`}>
            <form className={isSignup ? 'signup-form' : 'login-form'} onSubmit={handleSubmit}>
                <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
                <FormInput
                    label="Username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                {isSignup && (
                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                )}
                <FormInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                {isSignup && (
                    <FormInput
                        label="Sign up as:"
                        type="select"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        options={['Player', 'Designer']}
                        required
                    />
                )}
                <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
            </form>
            <p style={{ marginTop: '20px' }}>
                {isSignup ? (
                    <>Already have an account? <a href="/">Login</a></>
                ) : (
                    <>Don't have an account? <a href="/signup">Sign Up</a></>
                )}
            </p>
            <div className="toggle-container">
                <input
                    type="checkbox"
                    id="night-mode-toggle"
                    className="toggle-checkbox"
                    checked={isNightMode}
                    onChange={toggleNightMode}
                />
                <label htmlFor="night-mode-toggle" className="toggle-label"></label>
            </div>
        </div>
    );
}

export default LoginSignupForm;
