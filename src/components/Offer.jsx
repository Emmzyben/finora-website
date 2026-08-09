import React from 'react';

const whyUsData = [
    {
        icon: 'fas fa-credit-card',
        title: 'Multiple Payment Options',
        description: 'We support multiple payment methods: Visa, MasterCard, bank transfer, cryptocurrency and lots more.',
    },
    {
        icon: 'fas fa-globe',
        title: 'World Coverage',
        description: 'We provide services in 80% of countries around the globe, located in various continents.',
    },
    {
        icon: 'fas fa-percentage',
        title: 'Incredible Transaction Fee',
        description: 'Our transaction fees and rates are incredibly low for all customers and all market makers.',
    },
    {
        icon: 'fas fa-shield-alt',
        title: 'Secured Transactions',
        description: 'Your finances are secured with our advanced technologies that protect you against digital thefts and hacks.',
    },
    {
        icon: 'fas fa-lock',
        title: 'Strong Security',
        description: 'We offer unbeatable protection against DDoS attacks with full data encryption for all your transactions.',
    },
    {
        icon: 'fas fa-headset',
        title: '24/7 Support',
        description: 'Our customer care service is available at all times to attend to you and offer solutions to all your needs.',
    },
];

const delays = ['0.1s', '0.3s', '0.5s', '0.1s', '0.3s', '0.5s'];

const Offer = () => {
    return (
        <div className="container-fluid feature py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9f4ff 100%)' }}>
            <div className="container py-5">
                <div className="section-title mb-5 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="sub-style">
                        <h4 className="sub-title px-3 mb-0">What we Offer</h4>
                    </div>
                </div>

                <div className="row g-4 justify-content-center">
                    {whyUsData.map((item, index) => (
                        <div
                            key={index}
                            className="col-md-6 col-lg-4 col-xl-4 wow fadeInUp"
                            data-wow-delay={delays[index]}
                        >
                            <div
                                className="h-100 p-4 rounded-3 bg-white shadow-sm"
                                style={{
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(13,110,253,0.15)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                                }}
                            >
                                <div className="feature-icon mb-4">
                                    <div
                                        className="d-inline-flex align-items-center justify-content-center rounded-circle"
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            background: 'rgba(13,110,253,0.1)',
                                        }}
                                    >
                                        <i className={`${item.icon} fa-2x text-primary`}></i>
                                    </div>
                                </div>
                                <h5 className="mb-3 fw-bold">{item.title}</h5>
                                <p className="mb-0 text-muted">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Offer;
