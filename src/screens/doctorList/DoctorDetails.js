import React, { useState, useEffect } from "react";
import { Typography, Button } from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';

import DetailsHeader from "../../common/header/ModalHeader";

export default function DoctorDetails({ id, setViewDetailsModalOpen }) {
    const [name, updateName] = useState('');
    const [experience, updateExperience] = useState(0);
    const [speciality, updateSpeciaity] = useState('');
    const [dob, updateDob] = useState('');
    const [city, updateCity] = useState('');
    const [emailId, updateEmailId] = useState('');
    const [mobile, updateMobile] = useState('');
    const [rating, updateRating] = useState(0);

    useEffect(() => {
        (async function updateViewDetailsData() {
            if (!id)
                return null;
            try {
                const rawData = await fetch(`/doctors/${id}`, {
                    method: 'GET'
                });

                if (rawData.status === 200) {
                    const data = await rawData.json();
                    console.log(data);
                    updateName((data.firstName || '') + ' ' + (data.lastName || ''));
                    updateExperience(data.totalYearsOfExp || 0);
                    updateSpeciaity(data.speciality || '');
                    updateDob(data.dob || '');
                    updateCity((data.address || {}).city || '');
                    updateEmailId(data.emailId || '')
                    updateMobile(data.mobile || '');
                    updateRating(data.rating || 0);
                } else {
                    document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
                }
            } catch (error) {
                console.error({ error: error.message });
                document.getElementById('msg').innerHTML = '<br /><span style="color:red">Something went wrong.. Please try again later...</span><br />';
            }
        })();
    });

    return (
        <div>
            <DetailsHeader title="Doctor Details" />
            <br />
            <Typography variant="h5">
                Dr: {name}
            </Typography>
            <br />
            <Typography>
                Total Experience: {experience}
                <br />
                Speciality: {speciality}
                <br />
                Date Of Birth: {dob}
                <br />
                City: {city}
                <br />
                Email: {emailId}
                <br />
                Mobile: {mobile}
                <br />
                Rating: <Rating
                    name="read-only"
                    value={rating}
                    readOnly
                />
            </Typography>
            <Button
                variant="contained"
                color="secondary"
                style={{
                    margin: '15px 0',
                    width: '100%'
                }}
                onClick={() => setViewDetailsModalOpen(false)}
            >
                Close
            </Button>
        </div>
    );
};
