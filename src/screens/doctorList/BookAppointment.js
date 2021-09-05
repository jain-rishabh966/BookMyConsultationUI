import React from "react";
import { Typography, Button } from "@material-ui/core";
import DetailsHeader from "../../common/header/ModalHeader";

export default function BookAppointment({ setBookAppointmentModalOpen, doctorId }) {
    
    return (
        <div>
            <DetailsHeader title="Book an Appointment" />

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
