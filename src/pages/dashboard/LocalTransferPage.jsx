import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send, Wallet, User, Hash, Building2, CreditCard, MessageSquare, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import { apiRequest } from '../../lib/api';

const LocalTransferPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        amount: '0',
        beneficiary_name: '',
        beneficiary_account: '',
        bank_name: '',
        transfer_type: 'online',
        description: '',
        pin: '',
    });
    const [showPin, setShowPin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleQuickAmount = (val) => {
        setForm((prev) => ({ ...prev, amount: val === 'All' ? '0' : String(val) }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.pin || !form.beneficiary_name || !form.beneficiary_account || !form.bank_name || Number(form.amount) <= 0) {
            setMessage('Please complete the transfer details and enter your transaction PIN.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await apiRequest('transfer', {
                method: 'POST',
                body: {
                    transfer_type: 'local_transfer',
                    method: 'local_transfer',
                    amount: Number(form.amount),
                    currency: 'USD',
                    recipient_name: form.beneficiary_name,
                    recipient_account: form.beneficiary_account,
                    bank_name: form.bank_name,
                    description: form.description || 'Local transfer',
                    pin: form.pin,
                },
            });

            navigate('/dashboard/transactions');
        } catch (error) {
            setMessage(error.message || 'Transfer could not be submitted.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-content w-100 pb-5">
            {/* Title & breadcrumb */}
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Local Transfer</h3>
                <div className="text-muted small">
                    <Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-dark">Local Transfer</span>
                </div>
            </div>

            {/* Hero Banner */}
            <div
                className="card border-0 mb-4 text-white text-center position-relative overflow-hidden"
                style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #023888 0%, #1a56db 100%)', minHeight: '180px' }}
            >
                {/* Decorative waves */}
                <div className="position-absolute w-100" style={{ bottom: 0, left: 0, opacity: 0.2 }}>
                    <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '60px' }}>
                        <path d="M0,40 C300,80 600,0 900,40 C1050,60 1150,30 1200,40 L1200,80 L0,80 Z" fill="white" />
                        <path d="M0,55 C200,20 500,70 800,50 C1000,35 1150,60 1200,55 L1200,80 L0,80 Z" fill="white" opacity="0.5" />
                    </svg>
                </div>
                <div className="card-body py-5 position-relative" style={{ zIndex: 1 }}>
                    <div className="bg-white bg-opacity-25 rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '64px', height: '64px' }}>
                        <Send size={28} className="text-white" />
                    </div>
                    <h4 className="fw-bold text-white mb-1">Local Bank Transfer</h4>
                    <p className="text-white-50 mb-0">Send money to any local bank account securely</p>
                </div>
            </div>

            {/* Form card */}
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4">
                {/* Available Balance */}
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-10 rounded-3 d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px', color: '#023888' }}>
                            <Wallet size={20} />
                        </div>
                        <div>
                            <small className="text-muted d-block" style={{ fontSize: '0.78rem' }}>Available Balance</small>
                            <h5 className="mb-0 fw-bold">$0.00</h5>
                        </div>
                    </div>
                    <span className="badge text-success fw-semibold px-3 py-2 rounded-pill" style={{ backgroundColor: '#e8fdf0', fontSize: '0.8rem' }}>Available</span>
                </div>

                <div className="p-4">
                    {message && (
                        <div className="alert alert-danger mb-4" role="alert">{message}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Transfer Amount */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-dark mb-2">Transfer Amount</label>
                            <div
                                className="d-flex align-items-center px-3 py-2 rounded-3 border border-primary"
                                style={{ backgroundColor: '#fff', borderWidth: '2px !important' }}
                            >
                                <span className="text-muted fw-bold me-2 fs-5">$</span>
                                <input
                                    type="number"
                                    name="amount"
                                    className="form-control border-0 shadow-none p-0 fw-bold fs-4 text-dark"
                                    value={form.amount}
                                    onChange={handleChange}
                                    style={{ outline: 'none', caretColor: '#023888' }}
                                />
                                <span className="text-muted">.00</span>
                            </div>
                            <div className="d-flex gap-2 mt-3">
                                {[100, 500, 1000, 'All'].map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => handleQuickAmount(val)}
                                        className="btn btn-sm border rounded-pill px-3 py-1 fw-semibold"
                                        style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', fontSize: '0.85rem' }}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Beneficiary Details */}
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}>
                                1
                            </div>
                            <h6 className="mb-0 fw-bold">Beneficiary Details</h6>
                        </div>

                        <div className="card border rounded-3 p-4 mb-4">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label text-muted small mb-1">Beneficiary Account Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0 text-muted"><User size={16} /></span>
                                        <input
                                            type="text"
                                            name="beneficiary_name"
                                            value={form.beneficiary_name}
                                            onChange={handleChange}
                                            className="form-control border-start-0 ps-0"
                                            placeholder="Full name"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted small mb-1">Beneficiary Account Number</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0 text-muted"><Hash size={16} /></span>
                                        <input
                                            type="text"
                                            name="beneficiary_account"
                                            value={form.beneficiary_account}
                                            onChange={handleChange}
                                            className="form-control border-start-0 ps-0"
                                            placeholder="Account number"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted small mb-1">Bank Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0 text-muted"><Building2 size={16} /></span>
                                        <input
                                            type="text"
                                            name="bank_name"
                                            value={form.bank_name}
                                            onChange={handleChange}
                                            className="form-control border-start-0 ps-0"
                                            placeholder="Bank name"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted small mb-1">Transfer Type</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0 text-muted"><CreditCard size={16} /></span>
                                        <select name="transfer_type" value={form.transfer_type} onChange={handleChange} className="form-select border-start-0 ps-1">
                                            <option value="online">Online Banking</option>
                                            <option value="rtgs">RTGS</option>
                                            <option value="neft">NEFT</option>
                                            <option value="imps">IMPS</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}>
                                2
                            </div>
                            <h6 className="mb-0 fw-bold">Additional Information</h6>
                        </div>

                        <div className="card border rounded-3 p-4 mb-4">
                            <div className="mb-4">
                                <label className="form-label text-muted small mb-1">Description/Memo</label>
                                <div className="input-group align-items-start">
                                    <span className="input-group-text bg-white border-end-0 text-muted pt-2"><MessageSquare size={16} /></span>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        className="form-control border-start-0 ps-0"
                                        rows="3"
                                        placeholder="Purpose of transfer (optional)"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label text-muted small mb-1">Transaction PIN</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0 text-muted"><Lock size={16} /></span>
                                    <input
                                        type={showPin ? 'text' : 'password'}
                                        name="pin"
                                        className="form-control border-start-0 border-end-0 ps-0"
                                        placeholder="Enter PIN"
                                        value={form.pin}
                                        onChange={handleChange}
                                        maxLength={6}
                                    />
                                    <button
                                        className="input-group-text bg-white border-start-0 text-muted"
                                        onClick={() => setShowPin(!showPin)}
                                        type="button"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <small className="text-warning mt-1 d-block">This is your transaction PIN, not your login password</small>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="row g-3">
                            <div className="col-md-7">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn w-100 py-3 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                                    style={{ backgroundColor: '#6c8cf8', border: 'none', borderRadius: '10px' }}
                                >
                                    <Eye size={18} /> {loading ? 'Submitting...' : 'Preview Transfer'}
                                </button>
                            </div>
                            <div className="col-md-5">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="btn w-100 py-3 fw-bold bg-white d-flex align-items-center justify-content-center gap-2"
                                    style={{ border: '1px solid #dee2e6', borderRadius: '10px' }}
                                >
                                    <ArrowLeft size={18} /> Back to Dashboard
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Secure notice */}
            <div className="d-flex align-items-center gap-3 px-4 py-3 rounded-3 border" style={{ backgroundColor: '#f8f9fa' }}>
                <ShieldCheck size={22} className="text-success flex-shrink-0" />
                <div>
                    <span className="fw-semibold text-dark">Secure Transaction</span>
                    <p className="mb-0 text-muted small">All transfers are encrypted and processed securely. Your financial information is never stored on our servers.</p>
                </div>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center mt-5 pt-3 border-top text-muted small">
                <div>
                    <img src="/img/logo.png" alt="Logo" style={{ maxHeight: '20px', filter: 'grayscale(100%) opacity(50%)' }} className="me-2" />
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

export default LocalTransferPage;



