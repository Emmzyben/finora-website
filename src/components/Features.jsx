import React from 'react';

const Features = () => {
    return (
        <div className="container-fluid feature py-5">
            <div className="container py-5">
                <div className="section-title mb-5 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="sub-style">
                        <h4 className="sub-title px-3 mb-0">Why Choose Us</h4>
                    </div>
                </div>
                <div className="row g-4 justify-content-center">
                    {/* Render a few features to represent the section */}
                    <div className="col-md-6 col-lg-4 col-xl-3 wow fadeInUp" data-wow-delay="0.1s">
                        <div className="row-cols-1 feature-item p-4">
                            <div className="col-12">
                                <div className="feature-icon mb-4">
                                    <div className="p-3 d-inline-flex bg-white rounded">
                                        <i className="fas fa-wallet fa-4x text-primary"></i>
                                    </div>
                                </div>
                                <div className="feature-content d-flex flex-column">
                                    <h5 className="mb-4">Personal Banking</h5>
                                    <p className="mb-0">Customers enjoy convenient everyday banking with smart savings and payments.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 wow fadeInUp" data-wow-delay="0.3s">
                        <div className="row-cols-1 feature-item p-4">
                            <div className="col-12">
                                <div className="feature-icon mb-4">
                                    <div className="p-3 d-inline-flex bg-white rounded">
                                        <i className="fas fa-briefcase fa-4x text-primary"></i>
                                    </div>
                                </div>
                                <div className="feature-content d-flex flex-column">
                                    <h5 className="mb-4">SME Banking</h5>
                                    <p className="mb-0">Tailored lending and cash management for small businesses to grow and scale securely.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 wow fadeInUp" data-wow-delay="0.5s">
                        <div className="row-cols-1 feature-item p-4">
                            <div className="col-12">
                                <div className="feature-icon mb-4">
                                    <div className="p-3 d-inline-flex bg-white rounded">
                                        <i className="fas fa-building fa-4x text-primary"></i>
                                    </div>
                                </div>
                                <div className="feature-content d-flex flex-column">
                                    <h5 className="mb-4">Corporate Banking</h5>
                                    <p className="mb-0">Complete corporate cash solutions, treasury services and seamless international payments.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 col-xl-3 wow fadeInUp" data-wow-delay="0.7s">
                        <div className="row-cols-1 feature-item p-4">
                            <div className="col-12">
                                <div className="feature-icon mb-4">
                                    <div className="p-3 d-inline-flex bg-white rounded">
                                        <i className="fas fa-user fa-4x text-primary"></i>
                                    </div>
                                </div>
                                <div className="feature-content d-flex flex-column">
                                    <h5 className="mb-4">Personal Loans</h5>
                                    <p className="mb-0">Flexible loan products with fast approval and competitive rates for every need.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Features;
