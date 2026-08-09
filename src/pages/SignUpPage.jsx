import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        country: '',
        accountType: '',
        pin: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Sign Up Data:', formData);
        // Handle form submission
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h4 className="text-white mb-3">Personal Information</h4>
                        <p className="text-white-50 mb-4">Please provide your legal name as it appears on official documents</p>
                        <div className="row gy-3 gx-4">
                            <div className="col-xl-6">
                                <label className="text-white mb-2">Legal First Name *</label>
                                <input type="text" name="firstName" className="form-control py-3 border-primary bg-transparent text-white" placeholder="John" value={formData.firstName} onChange={handleChange} required />
                            </div>
                            <div className="col-xl-6">
                                <label className="text-white mb-2">Middle Name</label>
                                <input type="text" name="middleName" className="form-control py-3 border-primary bg-transparent text-white" placeholder="David" value={formData.middleName} onChange={handleChange} />
                            </div>
                            <div className="col-xl-6">
                                <label className="text-white mb-2">Legal Last Name *</label>
                                <input type="text" name="lastName" className="form-control py-3 border-primary bg-transparent text-white" placeholder="Smith" value={formData.lastName} onChange={handleChange} required />
                            </div>
                            <div className="col-xl-6">
                                <label className="text-white mb-2">Username *</label>
                                <input type="text" name="username" className="form-control py-3 border-primary bg-transparent text-white" placeholder="johnsmith123" value={formData.username} onChange={handleChange} required />
                            </div>
                            <div className="col-12 mt-4">
                                <button type="button" onClick={nextStep} className="btn btn-primary text-white w-100 py-3 px-5">Next</button>
                            </div>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <h4 className="text-white mb-3">Contact Information</h4>
                        <div className="row gy-3 gx-4">
                            <div className="col-xl-6">
                                <label className="text-white mb-2">Email Address *</label>
                                <input type="email" name="email" className="form-control py-3 border-primary bg-transparent text-white" placeholder="john.smith@example.com" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="col-xl-6">
                                <label className="text-white mb-2">Phone Number *</label>
                                <input type="tel" name="phone" className="form-control py-3 border-primary bg-transparent text-white" placeholder="+1 (234) 567-8901" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="col-12">
                                <label className="text-white mb-2">Country *</label>
                                <input type="text" name="country" className="form-control py-3 border-primary bg-transparent text-white" placeholder="Your Country" value={formData.country} onChange={handleChange} required />
                            </div>
                            <div className="col-6 mt-4">
                                <button type="button" onClick={prevStep} className="btn btn-outline-primary text-white w-100 py-3 px-5">Previous</button>
                            </div>
                            <div className="col-6 mt-4">
                                <button type="button" onClick={nextStep} className="btn btn-primary text-white w-100 py-3 px-5">Next</button>
                            </div>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <h4 className="text-white mb-3">Account Type *</h4>
                        <div className="row gy-3 gx-4">
                            <div className="col-12">
                                <select name="accountType" className="form-select py-3 border-primary bg-transparent text-white" value={formData.accountType} onChange={handleChange} required style={{ backgroundColor: '#02245b' }}>
                                    <option value="" disabled className="text-dark">Select Account Type</option>
                                    <option value="Checking" className="text-dark">Checking Account - Perfect for daily transactions and bill payments</option>
                                    <option value="Savings" className="text-dark">Savings Account - Earn interest on your deposits</option>
                                    <option value="Fixed Deposit" className="text-dark">Fixed Deposit Account - Highest interest rates for fixed terms</option>
                                    <option value="Current" className="text-dark">Current Account - For everyday business transactions</option>
                                    <option value="Crypto" className="text-dark">Crypto Currency Account - For digital currency management</option>
                                    <option value="Business" className="text-dark">Business Account - For small to medium businesses</option>
                                    <option value="Non Resident" className="text-dark">Non Resident Account - For international customers</option>
                                    <option value="Corporate" className="text-dark">Corporate Business Account - For large corporations</option>
                                    <option value="Investment" className="text-dark">Investment Account - For stocks and securities</option>
                                </select>
                            </div>
                            <div className="col-6 mt-4">
                                <button type="button" onClick={prevStep} className="btn btn-outline-primary text-white w-100 py-3 px-5">Previous</button>
                            </div>
                            <div className="col-6 mt-4">
                                <button type="button" onClick={nextStep} className="btn btn-primary text-white w-100 py-3 px-5">Next</button>
                            </div>
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <h4 className="text-white mb-3">Security</h4>
                        <p className="text-white-50 mb-4">Secure Your Account - Create a strong password to protect your account</p>
                        <div className="row gy-3 gx-4">
                            <div className="col-12">
                                <label className="text-white mb-2">Transaction PIN (4 digits) *</label>
                                <input type="password" name="pin" maxLength="4" className="form-control py-3 border-primary bg-transparent text-white" placeholder="••••" value={formData.pin} onChange={handleChange} required />
                            </div>
                            <div className="col-xl-6">
                                <label className="text-white mb-2">Password *</label>
                                <input type="password" name="password" className="form-control py-3 border-primary bg-transparent text-white" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div className="col-xl-6">
                                <label className="text-white mb-2">Confirm Password *</label>
                                <input type="password" name="confirmPassword" className="form-control py-3 border-primary bg-transparent text-white" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                            </div>
                            <div className="col-12 mt-3">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="agreeTerms" id="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} required />
                                    <label className="form-check-label text-white" htmlFor="agreeTerms">
                                        I agree to the <Link to="/terms" target="_blank" className="text-primary text-decoration-none">Terms of Service</Link> and <Link to="/privacy" target="_blank" className="text-primary text-decoration-none">Privacy Policy</Link>
                                    </label>
                                </div>
                            </div>
                            <div className="col-6 mt-4">
                                <button type="button" onClick={prevStep} className="btn btn-outline-primary text-white w-100 py-3 px-5">Previous</button>
                            </div>
                            <div className="col-6 mt-4">
                                <button type="submit" className="btn btn-primary text-white w-100 py-3 px-5">Register</button>
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container-fluid appointment py-5">
            <div className="container py-5">
                <div className="row g-5 justify-content-center">
                    <div className="col-lg-8 wow fadeIn" data-wow-delay="0.2s">
                        <div className="appointment-form rounded p-5">
                            <p className="fs-4 text-uppercase text-primary text-center">Open an Account</p>
                            <h1 className="display-5 mb-4 text-center text-white">Sign Up</h1>
                            
                            {/* Step Indicator */}
                            <div className="d-flex justify-content-center mb-5">
                                {[1, 2, 3, 4].map(s => (
                                    <div key={s} className="d-flex align-items-center">
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center ${step >= s ? 'bg-primary text-white' : 'bg-transparent border border-primary text-primary'}`} style={{ width: '35px', height: '35px' }}>
                                            {s}
                                        </div>
                                        {s < 4 && <div className={`mx-2 ${step > s ? 'bg-primary' : 'bg-transparent border-top border-primary'}`} style={{ width: '40px', height: '2px' }}></div>}
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit}>
                                {renderStep()}
                                <div className="col-12 text-center mt-5">
                                    <p className="text-white mb-0">Already have an account? <Link to="/sign-in" className="text-primary fw-bold">Sign In Here</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
