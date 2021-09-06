import React, { useEffect, useState } from "react";
import { Button, InputLabel, MenuItem, Select } from "@material-ui/core";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

import DetailsHeader from "../../common/header/ModalHeader";

export default function BookAppointment({ setBookAppointmentModalOpen, doctorId: id }) {
    const [doctorName, updateDoctorName] = useState('');
    const [selectedDate, handleDateChange] = useState(new Date());
    const [timeSlot, updateTimeSlot] = useState('');
    const [medicalHistory, updateMedicalHistory] = useState('');
    const [symptoms, updateSymptoms] = useState('');

    const [timeSlots, updateTimeSlots] = useState([]);

    useEffect(() => {
        // Doctor Details
        (async function updateViewDetailsData() {
            if (!id) return null;

            try {
                const rawData = await fetch(`/doctors/${id}`, {
                    method: 'GET'
                });

                if (rawData.status === 200) {
                    const data = await rawData.json();
                    updateDoctorName((data.firstName || '') + ' ' + (data.lastName || ''));
                } else {
                    document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
                }
            } catch (error) {
                console.error({ error: error.message });
                document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
            }
            loadDoctorTimeSlots(new Date());
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Doctor Time Slots by Date
    async function loadDoctorTimeSlots(selectedDate) {
        if (!id) return null;

        try {
            const rawData = await fetch(`/doctors/${id}/timeSlots?date=${
                ((new Date(selectedDate) || new Date()).toJSON() || '').substr(0, 10)
            }`, {
                method: 'GET'
            });

            if (rawData.status === 200) {
                const data = await rawData.json();
                if (!data || (data.timeSlot || []).length === 0) {
                    return;
                }
                updateTimeSlots(data.timeSlot)
            } else {
                document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
            }
        } catch (error) {
            console.error({ error: error.message });
            document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
        }
    };

    async function submitAppointment() {
        try {
            let userDetails = sessionStorage.getItem('user-details');
            if (userDetails) {
                userDetails = JSON.parse(userDetails);
            } else {
                alert('Please login');
                return;
            };
            
            const rawData = await fetch(`/appointments`, {
                method: 'POST',
                body: JSON.stringify({
                    "doctorId": id,
                    "doctorName": doctorName,
                    "userId": userDetails.id,
                    "userName": userDetails.firstName + ' ' + userDetails.lastName,
                    "userEmailId": userDetails.id,
                    "timeSlot": new Date(timeSlot).toJSON().substr(0, 10),
                    "appointmentDate": selectedDate,
                    "createdDate": new Date().toJSON().substr(0, 10),
                    "symptoms": symptoms,
                    "priorMedicalHistory": medicalHistory
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('access-token')}`
                }
            });

            if (rawData.status !== 200)
                throw new Error('Slot unavailable exception');
        } catch (error) {
            console.log(error);
            alert('Either the slot is already booked or not available');
        }
    };

    return (
        <div>
            <DetailsHeader title="Book an Appointment" />

            <ValidatorForm onSubmit={() => { }} onError={errors => console.error(errors)}>
                <br />
                <TextValidator
                    label="Doctor Name *"
                    name="doctorName"
                    validators={['required']}
                    errorMessages={['required']}
                    value={doctorName}
                    disabled
                />
                <br />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker label="Appointment Date" value={selectedDate} onChange={e => {
                        handleDateChange(e);
                        loadDoctorTimeSlots(e);
                    }} />
                </MuiPickersUtilsProvider>
                <br />
                <br />
                <InputLabel id="demo-simple-select-label">Timeslots</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    value={timeSlot}
                    onChange={e => updateTimeSlot(e.target.value)}
                    style={{
                        width: '45%'
                    }}
                >
                    {
                        timeSlots.map(e =>
                            <MenuItem key={e} value={e}>{e}</MenuItem>
                        )
                    }
                </Select>
                <br />
                <br />
                <InputLabel id="demo-simple-select-label">Medical History</InputLabel>
                <br />
                <br />
                <TextValidator
                    name="medicalHistory"
                    value={medicalHistory}
                    onChange={e => updateMedicalHistory(e.target.value)}
                />
                <br />
                <InputLabel id="demo-simple-select-label">Symptoms</InputLabel>
                <br />
                <br />
                <TextValidator
                    name="symptoms"
                    value={symptoms}
                    placeholder="Ex. Cold, Swelling etc."
                    onChange={e => updateSymptoms(e.target.value)}
                />
                <br />
                <Button
                    variant="contained"
                    color="primary"
                    style={{
                        margin: '15px 0',
                        width: '100%'
                    }}
                    onClick={() => submitAppointment()}
                >
                    Book Appointment
                </Button>
            </ValidatorForm>
            <Button
                variant="contained"
                color="secondary"
                style={{
                    margin: '15px 0',
                    width: '100%'
                }}
                onClick={() => setBookAppointmentModalOpen(false)}
            >
                Close
            </Button>
        </div>
    );
};
