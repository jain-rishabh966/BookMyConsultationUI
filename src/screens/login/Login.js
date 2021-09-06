import React, { useState } from "react";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Button } from '@material-ui/core';

import FormHeader from '../formHeader/FormHeader';

export default function LoginForm({ setUserLoggedIn, updateLoginModal, activePage, setActivePage, setSuccessMessage, deactivateModal }) {
    const loginHandler = async (username, password) => {
        try {
            const rawData = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    authorization: `Basic ${btoa(username + ':' + password)}`,
                    Accept: 'application/json;charset=UTF-8'
                },
            });
            const data = await rawData.json();
            if (rawData.status === 200) {
                window.sessionStorage.setItem('user-details', JSON.stringify(data));
                window.sessionStorage.setItem('access-token', data.accessToken);
                setUserLoggedIn(true);
                updateLoginModal(false);
            } else {
                alert(data.message || 'Something went wrong.. Please try again later...');
            }
        } catch (error) {
            console.error({ error: error.message });
            alert('Something went wrong.. Please try again later...');
        }
    }

    const [username, updateUsername] = useState('');
    const [password, updatePassword] = useState('');

    return (
        <div align="center">
            { React.createElement(FormHeader, { activeHeader: 'LOGIN', activePage, setActivePage, setSuccessMessage }) }
            <br />
            <ValidatorForm onSubmit={() => loginHandler(username, password)} onError={errors => console.error(errors)}>
                <TextValidator
                    label="Username *"
                    name="username"
                    id="username"
                    validators={['required', 'isEmail']}
                    errorMessages={['required', 'Enter a valid E-Mail ID']}
                    value={username}
                    onChange={e => updateUsername(e.target.value)}
                />
                <br />
                <TextValidator
                    label="Password *"
                    name="password"
                    id="password"
                    type="password"
                    validators={['required']}
                    errorMessages={['Password is required']}
                    value={password}
                    onChange={e => updatePassword(e.target.value)}
                />
                <br />
                <br />
                <div className="nav-buttons">
                    <Button type="submit" variant="contained" color="primary">LOGIN</Button>
                    <Button variant="contained" color="secondary" onClick={deactivateModal}>CANCEL</Button>
                </div>
            </ValidatorForm>
        </div>
    )
};
