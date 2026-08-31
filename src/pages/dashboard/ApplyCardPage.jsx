import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Info } from 'lucide-react';
import { apiRequest } from '../../lib/api';

const ApplyCardPage = () => {
    const navigate = useNavigate();
    const [cardType, setCardType] = useState('visa');
    const [form, setForm] = useState({
        card_level: 'standard',
        currency: 'USD',
        daily_spending_limit: '1000',
        cardholder_name: 'Test',
        billing_address: '',
        terms: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.terms) {
            setMessage('Please agree to the terms and conditions before submitting.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await apiRequest('apply-card', {
                method: 'POST',
                body: {
                    card_type: cardType,
                    card_level: form.card_level,
                    currency: form.currency,
                    daily_spending_limit: Number(form.daily_spending_limit),
                    cardholder_name: form.cardholder_name,
                    billing_address: form.billing_address,
                },
            });

            navigate('/dashboard/cards');
        } catch (error) {
            setMessage(error.message || 'Failed to submit card application.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-content w-100 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <div className="text-muted small mb-2">
                        <Link to="/dashboard" className="text-muted text-decoration-none hover-primary">Dashboard</Link>
                        <span className="mx-2">&gt;</span>
                        <Link to="/dashboard/cards" className="text-muted text-decoration-none hover-primary">Cards</Link>
                        <span className="mx-2">&gt;</span>
                        <span className="text-dark">Apply</span>
                    </div>
                    <h3 className="fw-bold mb-0">Apply for Virtual Card</h3>
                </div>
                <button
                    onClick={() => navigate('/dashboard/cards')}
                    className="btn btn-outline-secondary bg-white d-flex align-items-center px-3"
                    style={{ border: '1px solid #e5e4e7' }}
                >
                    <ArrowLeft size={16} className="me-2" /> Back to Cards
                </button>
            </div>

            {/* Banner */}
            <div className="card border-0 mb-4" style={{ borderRadius: '12px', backgroundColor: '#023888' }}>
                <div className="card-body p-4 p-md-5 d-flex justify-content-between align-items-center text-white">
                    <div>
                        <h4 className="fw-bold mb-2 text-white-50">Apply for a Virtual Card</h4>
                        <p className="mb-0 text-white-50">Get instant access to a virtual card for online payments and subscriptions</p>
                    </div>
                    <div className="d-none d-md-block opacity-50">
                        <CreditCard size={64} strokeWidth={1} />
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-3 p-4 p-md-5 mb-5">
                {message && (
                    <div className="alert alert-danger mb-4" role="alert">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <h5 className="fw-bold mb-4">Card Details</h5>

                    <div className="row g-4 mb-4">
                    <div className="col-md-7">
                        <label className="form-label text-dark mb-3">Card Type</label>

                        <div
                            className={`card mb-3 cursor-pointer ${cardType === 'visa' ? 'border-primary' : 'border'}`}
                            onClick={() => setCardType('visa')}
                            style={{ cursor: 'pointer', borderColor: cardType === 'visa' ? '#0d6efd' : '#e5e4e7' }}
                        >
                            <div className="card-body p-3 p-md-4 d-flex align-items-center">
                                <div className="form-check m-0">
                                    <input className="form-check-input" type="radio" checked={cardType === 'visa'} onChange={() => setCardType('visa')} />
                                </div>
                                <div className="ms-3 flex-grow-1">
                                    <h6 className="fw-bold mb-1">Visa</h6>
                                    <small className="text-muted">Accepted worldwide, suitable for most online purchases</small>
                                </div>
                                <div className="ms-3 text-primary fw-bold fst-italic" style={{ fontSize: '1.2rem' }}>VISA</div>
                            </div>
                        </div>

                        <div
                            className={`card mb-3 cursor-pointer ${cardType === 'mastercard' ? 'border-primary' : 'border'}`}
                            onClick={() => setCardType('mastercard')}
                            style={{ cursor: 'pointer', borderColor: cardType === 'mastercard' ? '#0d6efd' : '#e5e4e7' }}
                        >
                            <div className="card-body p-3 p-md-4 d-flex align-items-center">
                                <div className="form-check m-0">
                                    <input className="form-check-input" type="radio" checked={cardType === 'mastercard'} onChange={() => setCardType('mastercard')} />
                                </div>
                                <div className="ms-3 flex-grow-1">
                                    <h6 className="fw-bold mb-1">Mastercard</h6>
                                    <small className="text-muted">Global acceptance with enhanced security features</small>
                                </div>
                                <div className="ms-3 d-flex">
                                    <div className="rounded-circle bg-danger" style={{ width: '20px', height: '20px', marginRight: '-8px', opacity: 0.8 }}></div>
                                    <div className="rounded-circle bg-warning" style={{ width: '20px', height: '20px', opacity: 0.8 }}></div>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`card cursor-pointer ${cardType === 'amex' ? 'border-primary' : 'border'}`}
                            onClick={() => setCardType('amex')}
                            style={{ cursor: 'pointer', borderColor: cardType === 'amex' ? '#0d6efd' : '#e5e4e7' }}
                        >
                            <div className="card-body p-3 p-md-4 d-flex align-items-center">
                                <div className="form-check m-0">
                                    <input className="form-check-input" type="radio" checked={cardType === 'amex'} onChange={() => setCardType('amex')} />
                                </div>
                                <div className="ms-3 flex-grow-1">
                                    <h6 className="fw-bold mb-1">American Express</h6>
                                    <small className="text-muted">Premium benefits and exclusive rewards program</small>
                                </div>
                                <div className="ms-3 text-primary fw-bold text-uppercase p-1 border border-primary rounded" style={{ fontSize: '0.6rem', backgroundColor: '#e2ebfa' }}>
                                    American<br />Express
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div className="mb-4">
                            <label className="form-label text-dark">Card Level <span className="text-danger">*</span></label>
                            <select name="card_level" value={form.card_level} onChange={handleChange} className="form-select py-2">
                                <option value="">Select a card level</option>
                                <option value="standard">Standard - $450.00</option>
                                <option value="gold">Gold - $650.00</option>
                                <option value="platinum">Platinum - $700.00</option>
                                <option value="black">Black - $500.00</option>
                            </select>
                            <small className="text-muted mt-2 d-block">Different levels offer varied spending limits and features</small>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-5 pb-3 border-bottom">
                    <div className="col-md-6">
                        <label className="form-label text-dark">Currency</label>
                        <select name="currency" value={form.currency} onChange={handleChange} className="form-select py-2">
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label text-dark">Daily Spending Limit</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">$</span>
                            <input type="number" name="daily_spending_limit" className="form-control border-start-0 ps-0" value={form.daily_spending_limit} onChange={handleChange} min="1" />
                        </div>
                        <small className="text-muted mt-2 d-block">Limits: $ 1,000.00 - $10,000.00</small>
                    </div>
                </div>

                <h5 className="fw-bold mb-4">Billing Information</h5>
                <div className="mb-4">
                    <label className="form-label text-dark">Cardholder Name</label>
                    <input type="text" name="cardholder_name" className="form-control py-2" value={form.cardholder_name} onChange={handleChange} />
                    <small className="text-muted mt-2 d-block">Name as it will appear on your card</small>
                </div>
                <div className="mb-5 pb-4 border-bottom">
                    <label className="form-label text-dark">Billing Address</label>
                    <textarea name="billing_address" className="form-control py-2" rows="3" value={form.billing_address} onChange={handleChange} placeholder=""></textarea>
                    <small className="text-muted mt-2 d-block">Address used for verification when making purchases</small>
                </div>

                <div className="card mb-4 border-0" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="card-body p-4 d-flex">
                        <Info className="text-primary me-3 flex-shrink-0" size={24} />
                        <div>
                            <h6 className="fw-bold mb-2">Card Issuance Fee</h6>
                            <p className="text-muted mb-2">There is a one-time issuance fee for your new virtual card:</p>
                            <ul className="text-muted mb-3 ps-3">
                                <li className="mb-1">Standard: $450.00</li>
                                <li className="mb-1">Gold: $650.00</li>
                                <li className="mb-1">Platinum: $700.00</li>
                                <li className="mb-1">Black: $500.00</li>
                            </ul>
                            <p className="text-muted mb-0">The fee will be charged to your account immediately upon approval.</p>
                        </div>
                    </div>
                </div>

                <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" id="termsCheck" name="terms" checked={form.terms} onChange={handleChange} />
                    <label className="form-check-label ms-2" htmlFor="termsCheck">
                        <span className="fw-bold text-dark d-block">I agree to the terms and conditions</span>
                        <small className="text-muted">By applying for this card, you agree to our <Link to="/terms" className="text-primary text-decoration-none">Terms of Service</Link> and <Link to="/dashboard/support" className="text-primary text-decoration-none">Card Agreement</Link>.</small>
                    </label>
                </div>

                <div className="text-end">
                    <button type="submit" disabled={loading} className="btn btn-primary px-4 py-2 fw-bold" style={{ backgroundColor: '#023888', border: 'none' }}>
                        {loading ? 'Submitting...' : 'Apply for Card'}
                    </button>
                </div>
                </form>
            </div>

            {/* FAQ Section */}
            <h4 className="fw-bold mb-4 mt-5 pt-3">Frequently Asked Questions</h4>
            <div className="card border-0 shadow-sm rounded-3 p-4 p-md-5 mb-5">
                <div className="mb-4 pb-4 border-bottom">
                    <h6 className="fw-bold mb-2">How soon will my virtual card be ready?</h6>
                    <p className="text-muted mb-0">Virtual cards are typically issued within minutes after approval. You'll receive a notification when your card is ready to use.</p>
                </div>

                <div className="mb-4 pb-4 border-bottom">
                    <h6 className="fw-bold mb-2">Can I use my virtual card for all online purchases?</h6>
                    <p className="text-muted mb-0">Yes, your virtual card works for most online merchants that accept Visa or Mastercard. However, some merchants may require a physical card for verification purposes.</p>
                </div>

                <div>
                    <h6 className="fw-bold mb-2">What are the differences between card levels?</h6>
                    <p className="text-muted mb-1"><span className="fw-bold text-dark">Standard:</span> Basic features with lower spending limits and standard fraud protection.</p>
                    <p className="text-muted mb-1"><span className="fw-bold text-dark">Gold:</span> Higher spending limits, enhanced fraud protection, and basic rewards.</p>
                    <p className="text-muted mb-1"><span className="fw-bold text-dark">Platinum:</span> High spending limits, priority support, comprehensive fraud protection, and premium rewards.</p>
                    <p className="text-muted mb-0"><span className="fw-bold text-dark">Black:</span> Highest spending limits, concierge service, exclusive benefits, and elite rewards program.</p>
                </div>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top text-muted small pb-4">
                <div>

                    &copy; 2026 Finora. All rights reserved.
                </div>
                <div className="d-flex gap-3">
                    <Link to="/privacy" className="text-muted text-decoration-none hover-primary">Privacy Policy</Link>
                    <Link to="/terms" className="text-muted text-decoration-none hover-primary">Terms of Service</Link>
                    <Link to="/dashboard/support" className="text-muted text-decoration-none hover-primary">Contact Support</Link>
                </div>
            </div>
        </div>
    );
};

export default ApplyCardPage;



