import React from 'react';

const steps = [
    {
        number: '01',
        icon: 'fas fa-user-plus',
        title: 'Sign Up',
        description: 'Click on the registration button to register, verify yourself and get a new account in minutes.',
        delay: '0.1s',
    },
    {
        number: '02',
        icon: 'fas fa-cog',
        title: 'Set Up Your Account',
        description: 'Login to your account to add a new wallet and get your unique account number and transaction pin.',
        delay: '0.3s',
    },
    {
        number: '03',
        icon: 'fas fa-wallet',
        title: 'Fund Your Account',
        description: 'Make a deposit to your account to perform transactions and access our various services. Enjoy a secure payment system that protects your money and data from fraud.',
        delay: '0.5s',
    },
    {
        number: '04',
        icon: 'fas fa-exchange-alt',
        title: 'Perform Transactions',
        description: 'Explore our seamless services by performing various transactions on your account.',
        delay: '0.7s',
    },
];

const ProcessFlow = () => {
    return (
        <div
            className="container-fluid py-5"
            style={{
                background: 'linear-gradient(135deg, #0d7c92ff 0%, #0c6778ff 100%)',
            }}
        >
            <div className="container py-5">
                {/* Section Header */}
                <div className="section-title mb-5 wow fadeInUp text-center" data-wow-delay="0.1s">
                    <div className="section-title mb-5 wow fadeInUp" data-wow-delay="0.1s">
                        <div className="sub-style">
                            <h4 className="sub-title px-3 mb-0">How it works</h4>
                        </div>
                    </div>
                    <h1 className="display-3 mb-3 text-white">Our Process is Simple and Short</h1>
                    <p className="text-white-50 mb-0" style={{ maxWidth: '550px', margin: '0 auto' }}>
                        Get started with Finora in just four easy steps and take full control of your finances today.
                    </p>
                </div>

                {/* Steps */}
                <div className="row g-4 justify-content-center position-relative">

                    {/* Connecting dashed line (visible on lg+) */}
                    <div
                        className="d-none d-lg-block position-absolute"
                        style={{
                            top: '72px',
                            left: '5%',
                            right: '5%',
                            height: '2px',
                            borderTop: '2px dashed rgba(255,255,255,0.25)',
                            zIndex: 0,
                        }}
                    />

                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="col-sm-6 col-lg-3 wow fadeInUp"
                            data-wow-delay={step.delay}
                            style={{ zIndex: 1 }}
                        >
                            <div className="text-center h-100">
                                {/* Icon circle */}
                                <div
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4 position-relative"
                                    style={{
                                        width: '88px',
                                        height: '88px',
                                        background: 'rgba(255,255,255,0.12)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        backdropFilter: 'blur(8px)',
                                        transition: 'transform 0.3s ease, background 0.3s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'scale(1.1)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                                    }}
                                >
                                    <i className={`${step.icon} fa-2x text-white`}></i>

                                    {/* Step number badge */}
                                    <span
                                        className="position-absolute d-flex align-items-center justify-content-center rounded-circle fw-bold"
                                        style={{
                                            top: '-8px',
                                            right: '-8px',
                                            width: '28px',
                                            height: '28px',
                                            background: '#fff',
                                            color: '#0d6efd',
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        {index + 1}
                                    </span>
                                </div>

                                {/* Content */}
                                <h5 className="text-white fw-bold mb-3">{step.title}</h5>
                                <p className="text-white-50 mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.65' }}>
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-5 wow fadeInUp" data-wow-delay="0.9s">
                    <a
                        href="/sign-up"
                        className="btn btn-light rounded-pill text-primary fw-semibold py-3 px-5 me-3"
                    >
                        Open Account
                    </a>
                    <a
                        href="/about"
                        className="btn btn-outline-light rounded-pill py-3 px-5"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProcessFlow;
