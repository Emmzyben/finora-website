import React from 'react';

const AboutSection = () => {
    return (
        <div className="container-fluid about bg-light py-5">
            <div className="container py-5">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-5 wow fadeInLeft" data-wow-delay="0.2s">
                        <div className="about-img pb-5 ps-5">
                            <img src="/img/bg2.jpg" className="img-fluid rounded w-100" style={{ objectFit: 'cover' }} alt="Image" />
                            <div className="about-img-inner">
                                <img src="/img/pc.jpg" className="img-fluid rounded-circle w-100 h-100" alt="Image" />
                            </div>
                            <div className="about-experience">15 years experience</div>
                        </div>
                    </div>
                    <div className="col-lg-7 wow fadeInRight" data-wow-delay="0.4s">
                        <div className="section-title text-start mb-5">
                            <h4 className="sub-title pe-3 mb-0">About Us</h4>
                            <h1 className="display-4 mb-4">We are Ready to Help Improve Your Banking Experience.</h1>
                            <p className="mb-4">A few years ago, a small team of people determined to transform banking launched a savings app for everyone. That app was the first step toward FINORA Bank. Today, we’re even more determined and we’ve built a Central Bank-licensed, microfinance bank to help you get the best out of your money without overcharging you. FINORA includes tools for tracking your spending habits, saving more and making the right money moves. So no matter who you are or where you live, we’re here because of you. We know the pain that comes with using a regular bank and we will make things work better for everyone.</p>

                            <a href="/about" className="btn btn-primary rounded-pill text-white py-3 px-5">Learn More</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutSection;
