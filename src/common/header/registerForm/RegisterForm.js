import React, { useState } from "react";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Button } from '@material-ui/core';

import FormHeader from '../formHeader/FormHeader';

export default function RegisterForm({ setSuccessMessage, activePage, setActivePage, successMessage, deactivateModal }) {
    const registerHandler = async (firstName, lastName, emailId, password, mobile, dob) => {
        try {
            const rawData = await fetch('/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    emailId, firstName, lastName, mobile, password, dob,
                })
            });
            const data = await rawData.json();
            if (rawData.status === 200) {
                setSuccessMessage('Registration Successful. Please Login!');
            } else {
                alert(data.message || 'Something went wrong.. Please try again later...');
            }
        } catch (error) {
            console.error({ error: error.message });
            alert('Something went wrong.. Please try again later...');
        }
    }

    const [firstName, updateFirstName] = useState('');
    const [lastName, updateLastName] = useState('');
    const [email, updateEmail] = useState('');
    const [dob, updateDob] = useState('');
    const [password, updatePassword] = useState('');
    const [contactNo, updateContactNo] = useState('');

    return (
        <div align="center">
            { React.createElement(FormHeader, { activeHeader: 'REGISTER', activePage, setActivePage, setSuccessMessage }) }
            <br />
            <ValidatorForm onSubmit={() => { }} onError={errors => console.error(errors)}>
                <TextValidator
                    label="First Name *"
                    name="firstName"
                    validators={['required']}
                    errorMessages={['required']}
                    value={firstName}
                    onChange={e => updateFirstName(e.target.value)}
                />
                <br />
                <TextValidator
                    label="Last Name *"
                    name="lastName"
                    validators={['required']}
                    errorMessages={['required']}
                    value={lastName}
                    onChange={e => updateLastName(e.target.value)}
                />
                <br />
                <TextValidator
                    label="E-Mail *"
                    name="email"
                    validators={['required', 'isEmail']}
                    errorMessages={['required', 'Enter a valid E-Mail ID']}
                    value={email}
                    onChange={e => updateEmail(e.target.value)}
                />
                <br />
                <TextValidator
                    label="Password *"
                    name="password"
                    type="password"
                    validators={['required', 'matchRegexp:^(?=.*[0-9]).{1,}$', 'matchRegexp:^(?=.*[a-z]).{1,}$', 'matchRegexp:^(?=.*[A-Z]).{1,}$', 'matchRegexp:^(?=.*[@#$%^&-+=()])(?=\\S+$).{1,}$']}
                    errorMessages={['required', 'Password must have atlease 1 number', 'Password must have atlease 1 small letter', 'Password must have atlease 1 capital letter', 'Password must have atlease 1 special character']}
                    value={password}
                    onChange={e => updatePassword(e.target.value)}
                />
                <br />
                <TextValidator
                    label="Date Of Birth *"
                    name="dob"
                    type="date"
                    style={{ width: '45%' }}
                    validators={['required']}
                    errorMessages={['required']}
                    InputLabelProps={{ shrink: true }}
                    value={dob}
                    onChange={e => updateDob(e.target.value)}
                />
                <br />
                <TextValidator
                    label="Mobile No. *"
                    name="contactNo"
                    type="number"
                    validators={['required', 'matchRegexp:^[0-9]{8,10}$']}
                    errorMessages={['required', 'Enter a valid contact number']}
                    value={contactNo}
                    onChange={e => updateContactNo(e.target.value)}
                />
                <br />
                <div className="message">{successMessage}</div>
                <br />
                <div className="nav-buttons">
                    <Button variant="contained" color="primary" onClick={() => registerHandler(firstName, lastName, email, password, contactNo, dob)}>REGISTER</Button>
                    <Button variant="contained" color="secondary" onClick={deactivateModal}>CANCEL</Button>
                </div>
            </ValidatorForm>
        </div>
    )
}