import React from 'react';

const plans = [
    {
        type: 'Personal',
        account: 'Account',
        rate: '5%',
        label: 'DAILY INTEREST',
        details: [
            { icon: 'fas fa-dollar-sign', label: 'Minimum Amount', value: 'USD 1,000' },
            { icon: 'fas fa-sliders-h', label: 'Interval Type', value: 'Partial' },
            { icon: 'fas fa-calendar-alt', label: 'Get Interest Every', value: '1 Day' },
            { icon: 'fas fa-clock', label: 'Duration', value: '1 Month' },
        ],
        featured: false,
        delay: '0.1s',
        accentColor: '#15b9d9',
        ctaLabel: 'Get Started',
        ctaHref: '/sign-up',
    },
    {
        type: 'Corporate',
        account: 'Account',
        rate: '15%',
        label: 'DAILY INTEREST',
        details: [
            { icon: 'fas fa-dollar-sign', label: 'Minimum Amount', value: 'USD 10,000' },
            { icon: 'fas fa-sliders-h', label: 'Interval Type', value: 'Fixed' },
            { icon: 'fas fa-calendar-alt', label: 'Get Interest Every', value: '1 Day' },
            { icon: 'fas fa-clock', label: 'Duration', value: '1 Month' },
        ],
        featured: true,
        delay: '0.3s',
        accentColor: '#15b9d9',
        ctaLabel: 'Get Started',
        ctaHref: '/sign-up',
    },
];

const InterestRates = () => {
    return (
        <div className="container-fluid py-5" style={{ background: '#f8f9fa' }}>
            <div className="container py-5">

                {/* Section Header */}
                <div className="section-title mb-5 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="sub-style">
                        <h4 className="sub-title px-3 mb-0">Our Interest Rates</h4>
                    </div>
                    <h1 className="display-3 mb-4">Plans Tailored For You</h1>
                    <p className="mb-0">
                        We understand the needs of our customers very much, that is why our interest rates are attractive and competitive.
                    </p>
                </div>

                {/* Cards */}
                <div className="row g-4 justify-content-center">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className="col-md-6 col-lg-4 wow fadeInUp"
                            data-wow-delay={plan.delay}
                        >
                            <div
                                className="h-100 rounded-4 overflow-hidden position-relative"
                                style={{
                                    boxShadow: plan.featured
                                        ? '0 20px 50px rgba(13,110,253,0.22)'
                                        : '0 4px 20px rgba(0,0,0,0.08)',
                                    border: plan.featured
                                        ? '2px solid #15b9d9'
                                        : '2px solid #dee2e6',
                                    background: '#fff',
                                    borderRadius: '10px',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 24px 60px rgba(13,110,253,0.22)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = plan.featured
                                        ? '0 20px 50px rgba(13,110,253,0.22)'
                                        : '0 4px 20px rgba(0,0,0,0.08)';
                                }}
                            >
                                {/* Popular badge */}
                                {plan.featured && (
                                    <div
                                        className="text-center py-1 text-white fw-semibold"
                                        style={{
                                            background: '#15b9d9',
                                            fontSize: '0.8rem',
                                            letterSpacing: '1.5px',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        Most Popular
                                    </div>
                                )}

                                {/* Header */}
                                <div
                                    className="text-center p-5 pb-4"
                                    style={{
                                        background: plan.featured
                                            ? 'linear-gradient(135deg, #15b9d9 0%, #15b9d9 100%)'
                                            : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                                    }}
                                >
                                    {/* Icon */}
                                    <div
                                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            background: 'rgba(255,255,255,0.15)',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                        }}
                                    >
                                        <i className={`fas ${plan.featured ? 'fa-building' : 'fa-user'} fa-2x text-white`}></i>
                                    </div>

                                    <h4 className="text-white mb-1 fw-bold">{plan.type}</h4>
                                    <p className="text-white-50 mb-4" style={{ fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                        {plan.account}
                                    </p>

                                    {/* Rate */}
                                    <div
                                        className="d-inline-flex align-items-baseline justify-content-center px-4 py-2 rounded-pill"
                                        style={{ background: 'rgba(255,255,255,0.15)' }}
                                    >
                                        <span
                                            className="text-white fw-bold"
                                            style={{ fontSize: '3.5rem', lineHeight: 1 }}
                                        >
                                            {plan.rate}
                                        </span>
                                    </div>
                                    <p
                                        className="text-white-50 mt-2 mb-0 fw-semibold"
                                        style={{ fontSize: '0.75rem', letterSpacing: '2px' }}
                                    >
                                        {plan.label}
                                    </p>
                                </div>

                                {/* Detail rows */}
                                <div className="p-4">
                                    {plan.details.map((d, i) => (
                                        <div
                                            key={i}
                                            className="d-flex align-items-center justify-content-between py-3"
                                            style={{
                                                borderBottom: i < plan.details.length - 1 ? '1px solid #f0f0f0' : 'none',
                                            }}
                                        >
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        background: 'rgba(13,110,253,0.10)',
                                                    }}
                                                >
                                                    <i className={`${d.icon} text-primary`} style={{ fontSize: '0.85rem' }}></i>
                                                </div>
                                                <span className="text-muted" style={{ fontSize: '0.9rem' }}>{d.label}</span>
                                            </div>
                                            <span className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>{d.value}</span>
                                        </div>
                                    ))}

                                    {/* CTA */}
                                    <a
                                        href={plan.ctaHref}
                                        className={`btn w-100 rounded-pill py-3 mt-4 fw-semibold ${plan.featured ? 'btn-primary text-white' : 'btn-outline-primary'}`}
                                    >
                                        {plan.ctaLabel}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default InterestRates;
