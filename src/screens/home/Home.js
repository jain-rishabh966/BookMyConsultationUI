import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import "./Home.css";
import DoctorList from "../doctorList/DoctorList";
import Appointments from "../appointment/Appointment"
import Header from "../../common/header/Header";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={2}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function Home(props) {
    /* rendering state variables */
    const [userLoggedIn, setUserLoggedIn] = useState(window.sessionStorage.getItem('access-token') !== null);
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [appointments, updateAppointments] = useState([]);

    const [activePage, updateActivePage] = React.useState('DOCTORS');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    /* Render the active page */
    let activePageHtml = <Appointments {...props} appointments={appointments} updateAppointments={updateAppointments} userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />;
    if (activePage === 'DOCTORS') {
        activePageHtml = <DoctorList {...props} userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />
    }

    return (
        <div className={classes.root}>
            <Header {...props} userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} />
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab onClick={() => updateActivePage('DOCTORS')} label="DOCTORS" {...a11yProps(0)} />
                    <Tab onClick={() => updateActivePage('APPOINTMENT')} label="APPOINTMENT" {...a11yProps(1)} />
                </Tabs>
            </AppBar>

            {activePageHtml}
        </div>
    );
};
