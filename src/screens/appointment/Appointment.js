import React, { useEffect, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import Modal from 'react-modal';

import RateAppointment from "./RateAppointment";

/* Style for the pop-up Modal */
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

export default function Appointments(props) {
    /* State variables rendering */
    const { appointments, updateAppointments } = props;
    const [ratingModalOpen, updateRatingModalOpen] = useState(false);
    const [appointmentId, updateAppointmentId] = useState('');
    const [doctorId, updateDoctorId] = useState('');

    /* Checking if user is logged in if the access token is present */
    const isLoggedIn = () => sessionStorage.getItem('access-token') != null;

    useEffect(_ => {
        // Load appointments
        if (isLoggedIn()) {
            (async _ => {
                try {
                    let userDetails = sessionStorage.getItem('user-details');
                    if (userDetails) {
                        userDetails = JSON.parse(userDetails);
                    } else return;

                    const userEmail = userDetails.id;
                    const rawData = await fetch(`/users/${userEmail}/appointments`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('access-token')}`
                        }
                    });
        
                    if (rawData.status === 200) {
                        const data = await rawData.json();
                        updateAppointments(data);
                    } else {
                        document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
                    }
                } catch (error) {
                    console.error({ error: error.message });
                    document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
                }
            })();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.userLoggedIn]);

    let html = <h2>Login to see appointments</h2>;
    if (isLoggedIn()) {
        html = <div>
            {
                appointments.map(e => <div className="appointmentCard" align="left" key={e.appointmentId}>
                    <Typography variant="h5" component="h5">
                        Dr: {e.doctorName}
                    </Typography>
                    <br />
                    <Typography className="appointmentDetails">
                        Date: {e.appointmentDate}
                        <br />
                        Symptoms: {e.symptoms}
                        <br />
                        Prior Medical History: {e.priorMedicalHistory}
                    </Typography>
                    <br />
                    <Button
                        className="appointRateButton"
                        variant="contained"
                        color="primary"
                        onClick={_ => {
                            updateAppointmentId(e.appointmentId);
                            updateDoctorId(e.doctorId);
                            updateRatingModalOpen(true);    
                        }}
                    >
                        RATE APPOINTMENT
                    </Button>
                </div>)
            }
        </div>;
    }

    return (
        <div align="center">
            <div id="msg"></div>
            { html }
            <Modal
                style={modalStyle}
                isOpen={ratingModalOpen}
                ariaHideApp={false}
                appElement={document.getElementById('modal')}
            >
                <RateAppointment {...props} updateRatingModalOpen={updateRatingModalOpen} appointmentId={appointmentId} doctorId={doctorId} />
            </Modal>
        </div>
    );
};
