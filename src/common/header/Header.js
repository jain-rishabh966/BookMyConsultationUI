import React, { useState } from "react";
import { Button } from '@material-ui/core';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.jpeg';
import LoginForm from '../../screens/login/Login';
import RegisterForm from '../../screens/register/Register';
import './Header.css';

const modalStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        width: '20%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const Header = function ({ userLoggedIn, setUserLoggedIn }) {
    const deactivateModal = () => updateLoginModal(false);
    const activateModal = () => updateLoginModal(true);

    const [loginModal, updateLoginModal] = useState(false);
    const [activePage, setActivePage] = useState('LOGIN');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogout = async () => {
        try {
            const rawData = await fetch('/auth/logout', {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${window.sessionStorage.getItem('access-token')}`
                },
            });

            if (rawData.status === 200) {
                window.sessionStorage.removeItem('user-details');
                window.sessionStorage.removeItem('access-token');
                setUserLoggedIn(false);
            } else {
                alert('Something went wrong.. Please try again later...');
            }
        } catch (error) {
            console.error({ error: error.message });
            alert('Something went wrong.. Please try again later...');
        }
    }

    let activePageJS;
    if (activePage === 'LOGIN') {
        activePageJS = React.createElement(LoginForm, { setUserLoggedIn, updateLoginModal, activePage, setActivePage, setSuccessMessage, deactivateModal });
    } else if (activePage === 'REGISTER') {
        activePageJS = React.createElement(RegisterForm, { activePage, setActivePage, setSuccessMessage, successMessage, deactivateModal })
    }

    let loginLogoutBtn = React.createElement(Button, { variant: "contained", onClick: activateModal, color: "primary" }, 'Login');
    if (userLoggedIn) {
        loginLogoutBtn = React.createElement(Button, { variant: "contained", onClick: handleLogout, color: "secondary" }, 'Logout');
    }

    return (
        <div>
            <div className="header">
                <div>
                    <Link to={`/`}>
                        <img src={logo} height="35" className="logo" alt="LOGO" />
                        <div className="logoLabel">Doctor Finder</div>
                    </Link>
                </div>
                <div className="nav-buttons">
                    {loginLogoutBtn}
                </div>
            </div>
            <Modal
                style={modalStyle}
                isOpen={loginModal}
                ariaHideApp={false}
                appElement={document.getElementById('modal')}
            >
                {activePageJS}
            </Modal>
        </div>
    )
};

export default Header;
