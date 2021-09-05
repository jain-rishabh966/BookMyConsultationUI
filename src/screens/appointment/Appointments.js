import React, { useEffect, useState } from "react";
import { Button, Typography } from "@material-ui/core";

export default function Appointments(props) {
    const [appointments, updateAppointments] = useState(['']);

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
    }, []);

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
                    <Button className="appointRateButton" variant="contained" color="primary">RATE APPOINTMENT</Button>
                </div>)
            }
        </div>;
    }

    return (
        <div align="center">
            <div id="msg"></div>
            { html }
        </div>
    );
};
