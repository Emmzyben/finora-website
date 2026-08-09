import React from 'react';
import AboutSection from '../components/AboutSection';
import Features from '../components/Features';
import Offer from '../components/Offer';
import AboutSection2 from '../components/AboutSection2';
const About = () => {
    return (
        <>
            <div className="container-fluid bg-breadcrumb py-5">
                <div className="container text-center py-5" >
                    <h3 className="text-white display-3 mb-4 mt-5">About Us</h3>
                </div>
            </div>

            <AboutSection />
            <Features />
            <AboutSection2 />
            <Offer />
        </>
    );
};

export default About;
