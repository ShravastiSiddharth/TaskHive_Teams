import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../authentication/AuthContext';
import styles from '../styles/Signup.module.css';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axiosInstance from '../config/axiosInstance';


const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const { login } = useAuth();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name) errors.name = 'Name is required';
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.password) errors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        return errors;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axiosInstance.post('/auth/register', formData);
            login(response.data.token);
            toast.success('Sign up successful!');
        } catch (error) {
            setErrors({ server: error.response?.data?.msg || 'An error occurred. Please try again.' });
        }
    };

    return (<>
        <div className={styles.signupCont}>
            <div className={styles.signupForm}>
                <h1>Welcome to <span >WorkFlow!</span></h1>
                <form onSubmit={onSubmit}>
                    <div className={styles.formGroup}>
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={onChange} />
                        {errors.name && <div className={styles.error}>{errors.name}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={onChange} />
                        {errors.email && <div className={styles.error}>{errors.email}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={onChange} />
                        {errors.password && <div className={styles.error}>{errors.password}</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={onChange} />
                        {errors.confirmPassword && <div className={styles.error}>{errors.confirmPassword}</div>}
                    </div>
                    {errors.server && <div className={styles.error}>{errors.server}</div>}
                    <button type="submit" className={styles.mybtn}>Sign Up</button>
                </form>
                <br/>
               
                <div>Already have an account? <Link to='/'>LogIn</Link></div>
            </div>
        </div>
    </>
    );
};

export default SignUp;
