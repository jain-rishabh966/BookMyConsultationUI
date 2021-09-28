import React, { useEffect, useState } from "react";
import Rating from '@material-ui/lab/Rating';
import { Typography, Button } from "@material-ui/core";
import Modal from 'react-modal';
import DoctorDetails from "./DoctorDetails";
import BookAppointment from "./BookAppointment";

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

export default function DoctorList() {
    /* State variables rendering */
    const [specialities, updateSpecialities] = useState([]);
    const [speciality, updateSpeciality] = useState('');
    const [doctors, updateDoctors] = useState([]);

    const [doctorId, updateDoctorId] = useState('');

    /* State variables rendering for modal */
    const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
    const [bookAppointmentModalOpen, setBookAppointmentModalOpen] = useState(false);

    let countForSpecialityKey = 0;

    useEffect(_ => {
        // Load specialities
        (async _ => {
            try {
                const rawData = await fetch('/doctors/speciality', {
                    method: 'GET'
                });

                if (rawData.status === 200) {
                    const data = await rawData.json();
                    updateSpecialities(data);
                } else {
                    document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
                }
            } catch (error) {
                console.error({ error: error.message });
                document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
            }
        })();
    }, []);

    /* Reload on speciality change and initialization */
    useEffect(_ => {
        // Load doctors
        (async _ => {
            try {
                let url = 'doctors';
                if (speciality) {
                    url += `?speciality=${speciality}`
                }
                const rawData = await fetch(url, {
                    method: 'GET'
                });

                if (rawData.status === 200) {
                    const data = await rawData.json();
                    updateDoctors(data);
                } else {
                    document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
                }
            } catch (error) {
                console.error({ error: error.message });
                document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
            }
        })();
    }, [speciality]);

    return (
        <div className="selectSpeciality" align="center">
            <div id="msg"></div>
            <p>
                Select Speciality:
            </p>
            <select onChange={e => updateSpeciality(e.target.value)}>
                <option />
                {
                    specialities.map(e =>
                        <option key={countForSpecialityKey++}>{e}</option>
                    )
                }
            </select>

            <div className="doctorsList">
                {
                    doctors.map(e =>
                        <div key={e.id} align="left" className="doctorCard">
                            <div style={{ fontSize: 'x-large' }}>
                                Doctor Name: {e.firstName + ' ' + e.lastName}
                            </div>
                            <br />
                            <Typography className="doctorSpeciality">
                                Speciality: {e.speciality}
                            </Typography>
                            <Typography className="doctorRating">
                                Rating:
                                <Rating
                                    name="read-only"
                                    value={e.rating}
                                    readOnly
                                />
                            </Typography>
                            <div className="navigationButtons">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={_ => {
                                        setBookAppointmentModalOpen(true);
                                        updateDoctorId(e.id);
                                    }}
                                >
                                    BOOK APPOINTMENT
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ background: 'green' }}
                                    onClick={_ => {
                                        setViewDetailsModalOpen(true);
                                        updateDoctorId(e.id);
                                    }}
                                >
                                    VIEW DETAILS
                                </Button>
                            </div>
                        </div>
                    )
                }
            </div>
            <Modal
                style={modalStyle}
                isOpen={viewDetailsModalOpen || false}
                ariaHideApp={false}
                appElement={document.getElementById('modal')}
            >
                <DoctorDetails id={doctorId} setViewDetailsModalOpen={setViewDetailsModalOpen} />
            </Modal>
            <Modal
                style={modalStyle}
                isOpen={bookAppointmentModalOpen || false}
                ariaHideApp={false}
                appElement={document.getElementById('modal')}
            >
                <BookAppointment doctorId={doctorId} setBookAppointmentModalOpen={setBookAppointmentModalOpen} />
            </Modal>
        </div>
    );
};
