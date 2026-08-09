import React from 'react';
import Services from '../components/Services';

const ServicesPage = () => {
    return (
        <>
            <div className="container-fluid bg-breadcrumb py-5">
                <div className="container text-center py-5" >
                    <h3 className="text-white display-3 mb-4 mt-5">Our Services</h3>
                </div>
            </div>
            <Services />
        </>
    );
};

export default ServicesPage;
