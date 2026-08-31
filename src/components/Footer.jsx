import React from 'react';

const Footer = () => {
    return (
        <>
            <div className="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.2s">
                <div className="container py-5">
                    <div className="row g-5">
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <h4 className="text-white mb-4"><i className="fas fa-piggy-bank me-3"></i>Finora</h4>
                                <p>Finora is your trusted digital bank for everyday banking, business growth and secure financial services.</p>
                                <div className="d-flex align-items-center">
                                    <a className="btn-square btn btn-primary text-white rounded-circle mx-1" href=""><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn-square btn btn-primary text-white rounded-circle mx-1" href=""><i className="fab fa-twitter"></i></a>
                                    <a className="btn-square btn btn-primary text-white rounded-circle mx-1" href=""><i className="fab fa-instagram"></i></a>
                                    <a className="btn-square btn btn-primary text-white rounded-circle mx-1" href=""><i className="fab fa-linkedin-in"></i></a>
                                </div>

                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <h4 className="mb-4 text-white">Quick Links</h4>
                                <a href="/about"><i className="fas fa-angle-right me-2"></i> About Us</a>
                                <a href="/contact"><i className="fas fa-angle-right me-2"></i> Contact Us</a>
                                <a href="/privacy"><i className="fas fa-angle-right me-2"></i> Privacy Policy</a>
                                <a href="/terms"><i className="fas fa-angle-right me-2"></i> Terms & Conditions</a>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <h4 className="mb-4 text-white">Finora Services</h4>
                                <a href=""><i className="fas fa-angle-right me-2"></i> Personal Banking</a>
                                <a href=""><i className="fas fa-angle-right me-2"></i> SME Banking</a>
                                <a href=""><i className="fas fa-angle-right me-2"></i> Corporate Banking</a>
                                <a href=""><i className="fas fa-angle-right me-2"></i> Personal Loans</a>
                                <a href=""><i className="fas fa-angle-right me-2"></i> Digital Wallet</a>
                                <a href=""><i className="fas fa-angle-right me-2"></i> Investment Support</a>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <h4 className="mb-4 text-white">Contact Info</h4>
                                <a href=""><i className="fas fa-map-marker-alt me-2"></i> New York, USA</a>
                                <a href=""><i className="fas fa-envelope me-2"></i> support@finora.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid copyright py-4">
                <div className="container">
                    <div className="row g-4 align-items-center">
                        <div className="col-md-6 text-center text-md-start mb-md-0">
                            <span className="text-white"><a href="#"><i className="fas fa-copyright text-light me-2"></i>2023 Finora</a>, All right reserved.</span>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;
