import React from "react";
import AuthenticationHeader from '../AuthenticationHeader';

export default function FormHeader({ activeHeader, activePage, setActivePage, setSuccessMessage }) {
    return (
        <nav>
            <AuthenticationHeader />
            <div id="headerLoginRegister">
                <div className={activeHeader === 'LOGIN' ? 'active' : ''} onClick={() => { if (activePage !== 'LOGIN') setActivePage('LOGIN') }}>LOGIN</div>
                <div className={activeHeader === 'REGISTER' ? 'active' : ''} onClick={() => {
                    if (activePage !== 'REGISTER') {
                        setSuccessMessage('');
                        return setActivePage('REGISTER');
                    }
                }}>REGISTER</div>
            </div>
        </nav>
    );
}