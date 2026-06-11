import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from "react-router-dom"; //  CHANGED: useHistory -> useNavigate
//  CHANGED: Import modern auth functions directly from firebase/auth
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"; 
import { auth } from "./firebase";

function Login() {
    const navigate = useNavigate(); //  CHANGED: Initialize the modern navigator hook
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = e => {
        e.preventDefault();

        //  CHANGED: Modern Firebase syntax requires passing 'auth' as the first argument
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                // Login successful, redirect to home page
                navigate('/'); //  CHANGED: history.push('/') -> navigate('/')
            })
            .catch(error => alert(error.message));
    }

    const register = e => {
        e.preventDefault();

        //  CHANGED: Modern Firebase syntax for creating a user
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Successfully created a new user with email and password
                if (userCredential.user) {
                    navigate('/'); //  CHANGED: history.push('/') -> navigate('/')
                }
            })
            .catch(error => alert(error.message));
    }

    return (
        <div className='login'>
            <Link to='/'>
                <img
                    className="login__logo"
                    src='https://pngimg.com/uploads/amazon/amazon_PNG6.png' 
                    alt="Amazon Logo"
                />
            </Link>

            <div className='login__container'>
                <h1>Sign-in</h1>

                <form>
                    <h5>E-mail</h5>
                    <input type='text' value={email} onChange={e => setEmail(e.target.value)} />

                    <h5>Password</h5>
                    <input type='password' value={password} onChange={e => setPassword(e.target.value)} />

                    <button type='submit' onClick={signIn} className='login__signInButton'>Sign In</button>
                </form>

                <p>
                    By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use & Sale. Please
                    see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
                </p>

                <button onClick={register} className='login__registerButton'>Create your Amazon Account</button>
            </div>
        </div>
    )
}

export default Login;