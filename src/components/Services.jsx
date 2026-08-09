import React from 'react';

const Services = () => {
    return (
        <div className="container-fluid service py-5">
            <div className="container py-5">
                <div className="section-title mb-5 wow fadeInUp" data-wow-delay="0.2s">
                    <div className="sub-style">
                        <h4 className="sub-title px-3 mb-0">What We Do</h4>
                    </div>
                    <h1 className="display-3 mb-4">Financial services designed for modern investors.</h1>
                    <p className="mb-0">Finora delivers specialized solutions across investments, commodities, real estate and retirement planning with expert guidance and strong support.</p>
                </div>
                <div className="row g-4 justify-content-center">
                    <div className="col-md-6 col-lg-4 col-xl-3 wow fadeInUp" data-wow-delay="0.1s">
                        <div className="service-item rounded">
                            <div className="service-img rounded-top">
                                <img src="/img/service-1.jpg" className="img-fluid rounded-top w-100" alt="Forex trading" />
                            </div>
                            <div className="service-content rounded-bottom bg-light p-4">
                                <div className="service-content-inner">
                                    <h5 className="mb-4">Forex Services</h5>
                                    <p className="mb-4">Access competitive currency trading, hedging tools and global FX liquidity for smarter international business.</p>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 wow fadeInUp" data-wow-delay="0.3s">
                        <div className="service-item rounded">
                            <div className="service-img rounded-top">
                                <img src="/img/service-2.jpg" className="img-fluid rounded-top w-100" alt="Agriculture finance" />
                            </div>
                            <div className="service-content rounded-bottom bg-light p-4">
                                <div className="service-content-inner">
                                    <h5 className="mb-4">Agriculture Services</h5>
                                    <p className="mb-4">Support agribusiness growth with tailored financing, supply chain solutions and sustainable farming credit.</p>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 wow fadeInUp" data-wow-delay="0.5s">
                        <div className="service-item rounded">
                            <div className="service-img rounded-top">
                                <img src="/img/service-3.jpg" className="img-fluid rounded-top w-100" alt="Oil and gas finance" />
                            </div>
                            <div className="service-content rounded-bottom bg-light p-4">
                                <div className="service-content-inner">
                                    <h5 className="mb-4">Oil & Gas Services</h5>
                                    <p className="mb-4">Finance energy projects, manage commodity risk and support long-term capital needs in the oil and gas sector.</p>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 wow fadeInUp" data-wow-delay="0.7s">
                        <div className="service-item rounded">
                            <div className="service-img rounded-top">
                                <img src="/img/service-4.jpg" className="img-fluid rounded-top w-100" alt="Real estate finance" />
                            </div>
                            <div className="service-content rounded-bottom bg-light p-4">
                                <div className="service-content-inner">
                                    <h5 className="mb-4">Real Estate Services</h5>
                                    <p className="mb-4">Fund property acquisitions, development projects and investment portfolios with expert mortgage and capital solutions.</p>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 wow fadeInUp" data-wow-delay="0.9s">
                        <div className="service-item rounded">
                            <div className="service-img rounded-top">
                                <img src="/img/service-1.jpg" className="img-fluid rounded-top w-100" alt="Retirement planning" />
                            </div>
                            <div className="service-content rounded-bottom bg-light p-4">
                                <div className="service-content-inner">
                                    <h5 className="mb-4">Retirement & Insurance</h5>
                                    <p className="mb-4">Plan for the future with secure retirement portfolios and insurance coverage designed to protect your family.</p>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 wow fadeInUp" data-wow-delay="1.1s">
                        <div className="service-item rounded">
                            <div className="service-img rounded-top">
                                <img src="/img/service-2.jpg" className="img-fluid rounded-top w-100" alt="Gold investment" />
                            </div>
                            <div className="service-content rounded-bottom bg-light p-4">
                                <div className="service-content-inner">
                                    <h5 className="mb-4">Gold Services</h5>
                                    <p className="mb-4">Invest in bullion and metals with secure storage, transparent pricing and portfolio diversification options.</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
