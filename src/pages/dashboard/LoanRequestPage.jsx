import React from 'react';
import { Link } from 'react-router-dom';
import {
    Banknote, CheckCircle2, Clock, Percent, FileText, Shield,
    Home, Car, Briefcase, Users, Lock, HeartPulse, ChevronRight, HelpCircle
} from 'lucide-react';

const LoanRequestPage = () => {
    return (
        <div className="dashboard-content w-100 pb-5">
            {/* Title & breadcrumb */}
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Loan Services</h3>
                <div className="text-muted small">
                    <Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-dark">Loan Services</span>
                </div>
            </div>

            {/* Hero Banner */}
            <div
                className="card border-0 mb-5 text-white text-center position-relative overflow-hidden"
                style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #023888 0%, #1a56db 100%)', minHeight: '220px' }}
            >
                {/* Decorative circles */}
                <div className="position-absolute" style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', top: '-20px', right: '-20px' }}></div>
                <div className="position-absolute" style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', bottom: '20px', left: '10%' }}></div>

                {/* Waves */}
                <div className="position-absolute w-100" style={{ bottom: 0, left: 0, opacity: 0.2 }}>
                    <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '55px' }}>
                        <path d="M0,40 C300,80 600,0 900,40 C1050,60 1150,30 1200,40 L1200,80 L0,80 Z" fill="white" />
                        <path d="M0,55 C200,20 500,70 800,50 C1000,35 1150,60 1200,55 L1200,80 L0,80 Z" fill="white" opacity="0.5" />
                    </svg>
                </div>

                <div className="card-body py-5 d-flex flex-column justify-content-center align-items-center position-relative" style={{ zIndex: 1 }}>
                    <div
                        className="mb-3 d-flex align-items-center justify-content-center rounded-circle"
                        style={{ width: '70px', height: '70px', backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                        <Banknote size={32} color="#fff" />
                    </div>
                    <h3 className="fw-bold text-white mb-2">Loan Services</h3>
                    <p className="text-white-50 mb-0 fs-6">Financial solutions to help you achieve your goals</p>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4">

                {/* Why Choose Our Loan Services */}
                <div className="mb-5">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '32px', height: '32px', backgroundColor: '#e6f0ff' }}>
                            <CheckCircle2 size={18} className="text-primary" />
                        </div>
                        <h5 className="fw-bold mb-0 text-dark">Why Choose Our Loan Services</h5>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="card border-0 bg-light h-100 p-4" style={{ borderRadius: '12px' }}>
                                <div className="d-flex gap-3">
                                    <Clock className="text-primary flex-shrink-0" size={24} />
                                    <div>
                                        <h6 className="fw-bold mb-1">Quick Approval</h6>
                                        <p className="text-muted small mb-0">Get a decision within hours and funds within days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 bg-light h-100 p-4" style={{ borderRadius: '12px' }}>
                                <div className="d-flex gap-3">
                                    <Percent className="text-primary flex-shrink-0" size={24} />
                                    <div>
                                        <h6 className="fw-bold mb-1">Competitive Rates</h6>
                                        <p className="text-muted small mb-0">Low interest rates tailored to your credit profile</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 bg-light h-100 p-4" style={{ borderRadius: '12px' }}>
                                <div className="d-flex gap-3">
                                    <FileText className="text-primary flex-shrink-0" size={24} />
                                    <div>
                                        <h6 className="fw-bold mb-1">Simple Process</h6>
                                        <p className="text-muted small mb-0">Straightforward application with minimal paperwork</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 bg-light h-100 p-4" style={{ borderRadius: '12px' }}>
                                <div className="d-flex gap-3">
                                    <Shield className="text-primary flex-shrink-0" size={24} />
                                    <div>
                                        <h6 className="fw-bold mb-1">Secure & Confidential</h6>
                                        <p className="text-muted small mb-0">Your information is protected with bank-level security</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-5 border-light" />

                {/* Available Loan Types */}
                <div className="mb-5">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '32px', height: '32px', backgroundColor: '#e6f0ff' }}>
                            <Banknote size={18} className="text-primary" />
                        </div>
                        <h5 className="fw-bold mb-0 text-dark">Available Loan Types</h5>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-md-4">
                            <div className="card h-100 p-4 border" style={{ borderRadius: '12px', borderColor: '#e5e4e7' }}>
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <Home className="text-primary" size={20} />
                                    <h6 className="fw-bold mb-0">Personal Home Loans</h6>
                                </div>
                                <p className="text-muted small mb-0">Finance your dream home with competitive rates</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 p-4 border" style={{ borderRadius: '12px', borderColor: '#e5e4e7' }}>
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <Car className="text-primary" size={20} />
                                    <h6 className="fw-bold mb-0">Automobile Loans</h6>
                                </div>
                                <p className="text-muted small mb-0">Get on the road with flexible auto financing</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 p-4 border" style={{ borderRadius: '12px', borderColor: '#e5e4e7' }}>
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <Briefcase className="text-primary" size={20} />
                                    <h6 className="fw-bold mb-0">Business Loans</h6>
                                </div>
                                <p className="text-muted small mb-0">Grow your business with tailored financing solutions</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 p-4 border" style={{ borderRadius: '12px', borderColor: '#e5e4e7' }}>
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <Users className="text-primary" size={20} />
                                    <h6 className="fw-bold mb-0">Joint Mortgage</h6>
                                </div>
                                <p className="text-muted small mb-0">Share responsibility with a co-borrower</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 p-4 border" style={{ borderRadius: '12px', borderColor: '#e5e4e7' }}>
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <Lock className="text-primary" size={20} />
                                    <h6 className="fw-bold mb-0">Secured Overdraft</h6>
                                </div>
                                <p className="text-muted small mb-0">Access funds when needed with asset backing</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 p-4 border" style={{ borderRadius: '12px', borderColor: '#e5e4e7' }}>
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <HeartPulse className="text-primary" size={20} />
                                    <h6 className="fw-bold mb-0">Health Finance</h6>
                                </div>
                                <p className="text-muted small mb-0">Cover medical expenses with flexible payment options</p>
                            </div>
                        </div>
                    </div>

                  
                </div>

                <hr className="my-5 border-light" />

                {/* How It Works */}
                <div className="mb-5">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '32px', height: '32px', backgroundColor: '#e6f0ff' }}>
                            <Clock size={18} className="text-primary" />
                        </div>
                        <h5 className="fw-bold mb-0 text-dark">How It Works</h5>
                    </div>

                    <div className="position-relative ms-3">
                        {/* Connecting line */}
                        <div className="position-absolute border-start border-2" style={{ left: '15px', top: '24px', bottom: '24px', borderColor: '#e6f0ff' }}></div>

                        <div className="d-flex gap-4 mb-4 position-relative">
                            <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 text-white fw-bold" style={{ width: '32px', height: '32px', backgroundColor: '#6c8cf8', zIndex: 1 }}>1</div>
                            <div>
                                <h6 className="fw-bold mb-1">Apply Online</h6>
                                <p className="text-muted small mb-0">Complete our simple online application form with your details and loan requirements</p>
                            </div>
                        </div>

                        <div className="d-flex gap-4 mb-4 position-relative">
                            <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 text-white fw-bold" style={{ width: '32px', height: '32px', backgroundColor: '#6c8cf8', zIndex: 1 }}>2</div>
                            <div>
                                <h6 className="fw-bold mb-1">Quick Review</h6>
                                <p className="text-muted small mb-0">Our team reviews your application and may contact you for additional information</p>
                            </div>
                        </div>

                        <div className="d-flex gap-4 position-relative">
                            <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 text-white fw-bold" style={{ width: '32px', height: '32px', backgroundColor: '#6c8cf8', zIndex: 1 }}>3</div>
                            <div>
                                <h6 className="fw-bold mb-1">Approval & Disbursement</h6>
                                <p className="text-muted small mb-0">Once approved, the loan amount will be transferred to your account</p>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-5 border-light" />

                {/* FAQs */}
                <div className="mb-5">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '32px', height: '32px', backgroundColor: '#e6f0ff' }}>
                            <HelpCircle size={18} className="text-primary" />
                        </div>
                        <h5 className="fw-bold mb-0 text-dark">Frequently Asked Questions</h5>
                    </div>

                    <div className="card border mb-3" style={{ borderRadius: '12px', borderColor: '#e5e4e7' }}>
                        <div className="card-body p-4">
                            <h6 className="fw-bold mb-2">What documents do I need to apply?</h6>
                            <p className="text-muted small mb-0">You'll need identification, proof of income, and address verification. Additional documents may be requested based on loan type.</p>
                        </div>
                    </div>

                    <div className="card border mb-4" style={{ borderRadius: '12px', borderColor: '#e5e4e7' }}>
                        <div className="card-body p-4">
                            <h6 className="fw-bold mb-2">How long does approval take?</h6>
                            <p className="text-muted small mb-0">Standard applications are typically processed within 1-3 business days, depending on verification requirements.</p>
                        </div>
                    </div>

                    <Link to="/dashboard/support" className="text-primary text-decoration-none fw-semibold small d-inline-flex align-items-center">
                        View all FAQs <ChevronRight size={16} />
                    </Link>
                </div>

                {/* Call to Action Banner */}
                <div className="card border-0 text-center p-5" style={{ borderRadius: '16px', backgroundColor: '#eef3ff' }}>
                    <h4 className="fw-bold text-dark mb-2">Ready to get started?</h4>
                    <p className="text-muted mb-4">Apply now and get a decision on your loan application quickly</p>
                    <div>
                        <Link to="/dashboard/loan/apply" className="btn btn-primary fw-bold px-4 py-2" style={{ borderRadius: '8px' }}>
                            Apply for a Loan
                        </Link>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center mt-5 pt-3 border-top text-muted small">
                <div>

                    &copy; 2026 Finora. All rights reserved.
                </div>
                <div className="d-flex gap-3">
                    <Link to="/privacy" className="text-muted text-decoration-none">Privacy Policy</Link>
                    <Link to="/terms" className="text-muted text-decoration-none">Terms of Service</Link>
                    <Link to="/dashboard/support" className="text-muted text-decoration-none">Contact Support</Link>
                </div>
            </div>
        </div>
    );
};

export default LoanRequestPage;



