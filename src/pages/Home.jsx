import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import AboutSection from '../components/AboutSection';
import Features from '../components/Features';
import Offer from '../components/Offer';
import ProcessFlow from '../components/ProcessFlow';
import InterestRates from '../components/InterestRates';
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';

const Home = () => {
    return (
        <>
            <HeroCarousel />
            <AboutSection />
            <Features />
            <Offer />
            <ProcessFlow />
            <InterestRates />
            <FAQ />
            <Testimonials />
        </>
    );
};

export default Home;
