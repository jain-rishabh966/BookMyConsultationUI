import React, { useState } from "react";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Rating from '@material-ui/lab/Rating';
import { Button } from "@material-ui/core";

import RateAppointmentHeader from "../../common/header/ModalHeader";

export default function RateAppointment({ updateRatingModalOpen, appointmentId, doctorId }) {
    /* State variables rendering */
    const [comments, updateComments] = useState('');
    const [rating, updateRating] = useState(0);

    /* A handler for submitting ratings */
    async function submitRating(comments, rating, appointmentId, doctorId) {
        try {
            let userDetails = sessionStorage.getItem('user-details');
            if (userDetails) {
                userDetails = JSON.parse(userDetails);
            } else return;

            const rawData = await fetch(`/ratings`, {
                method: 'POST',
                body: JSON.stringify({
                    "appointmentId": appointmentId,
                    "doctorId": doctorId,
                    "rating": rating,
                    "comments": comments
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('access-token')}`
                }
            });

            if (rawData.status !== 200)
                throw new Error('Unknown Exception');

            updateRatingModalOpen(false);
        } catch (error) {
            console.log(error);
            alert('Something went wrong... Cowuld not post the rating...');
        }
    };

    return (
        <div>
            <RateAppointmentHeader title="Rate an Appointment" />

            <ValidatorForm onSubmit={() => { }} onError={errors => console.error(errors)}>
                <br />
                <TextValidator
                    label="Comments"
                    name="comments"
                    value={comments}
                    onChange={e => updateComments(e.target.value)}
                />
                <br />
                Rating: <Rating
                    name="appointmentRating"
                    value={rating}
                    onChange={e => updateRating(Number(e.target.value))}
                />
                <br />
                <Button
                    variant="contained"
                    color="primary"
                    style={{
                        margin: '15px 0',
                        width: '100%'
                    }}
                    onClick={() => submitRating(comments, rating, appointmentId, doctorId)}
                >
                    Rate Appointment
                </Button>
            </ValidatorForm>
            
            <Button
                variant="contained"
                color="secondary"
                style={{
                    margin: '15px 0',
                    width: '100%'
                }}
                onClick={() => updateRatingModalOpen(false)}
            >
                Close
            </Button>
        </div>
    );
};
