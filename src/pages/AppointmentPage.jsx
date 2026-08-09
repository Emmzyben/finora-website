import React from 'react';
import Appointment from '../components/Appointment';

const AppointmentPage = () => {
    return (
        <>
            <div className="container-fluid bg-breadcrumb py-5">
                <div className="container text-center py-5">
                    <h3 className="text-white display-3 mb-4">Book Appointment</h3>
                </div>
            </div>
            <Appointment />
        </>
    );
};

export default AppointmentPage;
