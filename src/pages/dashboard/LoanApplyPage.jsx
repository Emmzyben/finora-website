import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileEdit, ArrowLeft, Banknote, Wallet, X } from 'lucide-react';
import { apiRequest } from '../../lib/api';

const LoanApplyPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({
        loan_amount: '',
        loan_duration_months: '12',
        credit_facility: '',
        loan_purpose: '',
        monthly_net_income: '$2,000 - $5,000',
        terms_accepted: false,
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.terms_accepted) {
            setMessage('Please accept the terms and conditions before submitting.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await apiRequest('apply-loan', {
                method: 'POST',
                body: {
                    loan_amount: Number(form.loan_amount),
                    loan_duration_months: Number(form.loan_duration_months),
                    credit_facility: form.credit_facility,
                    loan_purpose: form.loan_purpose,
                    monthly_net_income: form.monthly_net_income,
                    terms_accepted: Boolean(form.terms_accepted),
                },
            });

            navigate('/dashboard/viewloan');
        } catch (error) {
            setMessage(error.message || 'Failed to submit loan application.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-content w-100 pb-5">
            {/* Title & breadcrumb */}
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Loan Services</h3>
                <div className="text-muted small">
                    <Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link>
                    <span className="mx-2">&gt;</span>
                    <Link to="/dashboard/loan" className="text-muted text-decoration-none">Loan Services</Link>
                </div>
            </div>

            {/* Hero Banner */}
            <div
                className="card border-0 mb-4 text-white text-center position-relative overflow-hidden"
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
                        <FileEdit size={32} color="#fff" />
                    </div>
                    <h3 className="fw-bold text-white mb-2">Loan Application Form</h3>
                    <p className="text-white-50 mb-0 fs-6">Complete the form below to apply for a loan</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4">
                {message && (
                    <div className="alert alert-danger mb-4" role="alert">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <Link to="/dashboard/loan" className="text-muted text-decoration-none d-flex align-items-center gap-2">
                            <ArrowLeft size={18} /> Back to Information
                        </Link>
                        <span className="text-danger small">* Required fields</span>
                    </div>

                    {/* Section 1: Loan Details */}
                    <div className="mb-5">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: '32px', height: '32px', backgroundColor: '#6c8cf8' }}>
                                <Banknote size={16} color="#fff" />
                            </div>
                            <h5 className="fw-bold mb-0 text-dark">Loan Details</h5>
                        </div>

                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label text-dark small fw-semibold mb-1">Loan Amount $ <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0 text-muted fw-bold">$</span>
                                    <input type="number" name="loan_amount" value={form.loan_amount} onChange={handleChange} className="form-control border-start-0 ps-0" placeholder="Enter loan amount" min="1" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-dark small fw-semibold mb-1">Duration (Months) <span className="text-danger">*</span></label>
                                <select name="loan_duration_months" value={form.loan_duration_months} onChange={handleChange} className="form-select text-muted">
                                    <option value="6">6 Months</option>
                                    <option value="12">12 Months</option>
                                    <option value="24">24 Months</option>
                                    <option value="36">36 Months</option>
                                    <option value="48">48 Months</option>
                                    <option value="60">60 Months</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label text-dark small fw-semibold mb-1">Credit Facility <span className="text-danger">*</span></label>
                                <select name="credit_facility" value={form.credit_facility} onChange={handleChange} className="form-select text-muted">
                                    <option value="">Select Loan/Credit Facility</option>
                                    <option value="Personal Home Loans">Personal Home Loans</option>
                                    <option value="Automobile Loans">Automobile Loans</option>
                                    <option value="Business Loans">Business Loans</option>
                                    <option value="Joint Mortgage">Joint Mortgage</option>
                                    <option value="Secured Overdraft">Secured Overdraft</option>
                                    <option value="Health Finance">Health Finance</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label text-dark small fw-semibold mb-1">Purpose of Loan <span className="text-danger">*</span></label>
                                <textarea name="loan_purpose" value={form.loan_purpose} onChange={handleChange} className="form-control" rows="4" placeholder="Please describe the purpose of this loan..."></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Financial Information */}
                    <div className="mb-5">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: '32px', height: '32px', backgroundColor: '#6c8cf8' }}>
                                <Wallet size={16} color="#fff" />
                            </div>
                            <h5 className="fw-bold mb-0 text-dark">Financial Information</h5>
                        </div>

                        <div className="row g-4">
                            <div className="col-12">
                                <label className="form-label text-dark small fw-semibold mb-1">Monthly Net Income <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0 text-muted fw-bold">$</span>
                                    <select name="monthly_net_income" value={form.monthly_net_income} onChange={handleChange} className="form-select border-start-0 ps-0 text-muted">
                                        <option value="Less than $2,000">Less than $2,000</option>
                                        <option value="$2,000 - $5,000">$2,000 - $5,000</option>
                                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                                        <option value="More than $10,000">More than $10,000</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="card border mb-5" style={{ backgroundColor: '#fdfcfe', borderColor: '#f1f3f5', borderRadius: '12px' }}>
                        <div className="card-body p-4">
                            <div className="form-check d-flex gap-2">
                                <input className="form-check-input mt-1" type="checkbox" id="termsCheck" name="terms_accepted" checked={form.terms_accepted} onChange={handleChange} />
                                <label className="form-check-label text-dark small" htmlFor="termsCheck">
                                    <span className="fw-bold d-block mb-1">I agree to the terms and conditions</span>
                                    <span className="text-muted">By submitting this application, I confirm that all information provided is accurate and complete. I authorize Finora to verify my information and credit history.</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="row g-3">
                        <div className="col-md-7">
                            <button type="submit" disabled={loading} className="btn w-100 py-3 fw-bold text-white" style={{ backgroundColor: '#0047a5', border: 'none', borderRadius: '8px' }}>
                                {loading ? 'Submitting...' : 'Submit Loan Application'}
                            </button>
                        </div>
                        <div className="col-md-5">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard/loan')}
                                className="btn w-100 py-3 fw-bold bg-white d-flex align-items-center justify-content-center gap-2"
                                style={{ border: '1px solid #dee2e6', borderRadius: '8px', color: '#495057' }}
                            >
                                <X size={18} /> Cancel
                            </button>
                        </div>
                    </div>
                </form>

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

export default LoanApplyPage;



