import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff, MessageSquare, Send, ShieldCheck, User, Hash } from 'lucide-react';
import { apiRequest } from '../../lib/api';

const CashAppTransferPage = () => {
    const navigate = useNavigate();
    const [showPin, setShowPin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({
        amount: '0.00',
        recipient_name: '',
        recipient_account: '',
        note: '',
        pin: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.recipient_account || !form.recipient_name || !form.pin || Number(form.amount) <= 0) {
            setMessage('Please provide the cashtag, full name, amount, and transaction PIN.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await apiRequest('transfer', {
                method: 'POST',
                body: {
                    transfer_type: 'cashapp_transfer',
                    method: 'cashapp_transfer',
                    amount: Number(form.amount),
                    currency: 'USD',
                    recipient_name: form.recipient_name,
                    recipient_account: form.recipient_account,
                    description: form.note || 'Cash App transfer',
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
            <div className="mb-4">
                <h3 className="fw-bold mb-1">International Transfer</h3>
                <div className="text-muted small">
                    <Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link>
                    <span className="mx-2">&gt;</span>
                    <Link to="/dashboard/internationaltransfer" className="text-muted text-decoration-none">International Transfer</Link>
                </div>
            </div>

            <div className="card border-0 mb-4 text-white text-center position-relative overflow-hidden" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #023888 0%, #1a56db 100%)', minHeight: '200px' }}>
                <button onClick={() => navigate('/dashboard/internationaltransfer')} className="position-absolute top-0 start-0 m-3 btn btn-sm text-white d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', zIndex: 2 }}>
                    <ArrowLeft size={18} />
                </button>
                <div className="position-absolute" style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', top: '20px', right: '30%' }}></div>
                <div className="position-absolute w-100" style={{ bottom: 0, left: 0, opacity: 0.2 }}>
                    <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '55px' }}>
                        <path d="M0,40 C300,80 600,0 900,40 C1050,60 1150,30 1200,40 L1200,80 L0,80 Z" fill="white" />
                        <path d="M0,55 C200,20 500,70 800,50 C1000,35 1150,60 1200,55 L1200,80 L0,80 Z" fill="white" opacity="0.5" />
                    </svg>
                </div>

                <div className="card-body py-5 d-flex flex-column justify-content-center align-items-center position-relative" style={{ zIndex: 1 }}>
                    <div className="mb-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255,255,255,0.15)' }}>
                        <svg viewBox="0 0 24 24" width="36" height="36" fill="none">
                            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">$</text>
                        </svg>
                    </div>
                    <h4 className="fw-bold text-white mb-2">Cash App Withdrawal</h4>
                    <p className="text-white-50 mb-0">Withdrawals to Cash App are typically processed within 24 hours.</p>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-3 p-4 p-md-5 mb-4">
                {message && (
                    <div className="alert alert-danger mb-4" role="alert">{message}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label fw-semibold text-dark mb-2">Amount to Transfer</label>
                        <div className="d-flex align-items-center px-3 py-2 rounded-3 border" style={{ borderColor: '#6c8cf8', borderWidth: '2px', backgroundColor: '#f5f8ff' }}>
                            <span className="text-muted fw-bold me-2 fs-5">$</span>
                            <input type="number" name="amount" className="form-control border-0 shadow-none p-0 fw-bold fs-4 text-dark bg-transparent" value={form.amount} onChange={handleChange} />
                            <span className="text-muted">.00</span>
                        </div>
                        <small className="text-muted mt-1 d-block">Available balance: $0.00</small>
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-dark small mb-1">$Cashtag</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted"><Hash size={16} style={{ opacity: 0 }} /><div className="position-absolute start-0 ms-3"><Hash size={16} /></div></span>
                            <input type="text" name="recipient_account" className="form-control border-start-0 ps-0" placeholder="Enter your $Cashtag" value={form.recipient_account} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-dark small mb-1">Full Name</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted"><User size={16} style={{ opacity: 0 }} /><div className="position-absolute start-0 ms-3"><User size={16} /></div></span>
                            <input type="text" name="recipient_name" className="form-control border-start-0 ps-0" placeholder="Enter your full name" value={form.recipient_name} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-dark small mb-1">Transaction PIN</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted"><Lock size={16} style={{ opacity: 0 }} /><div className="position-absolute start-0 ms-3"><Lock size={16} /></div></span>
                            <input type={showPin ? 'text' : 'password'} name="pin" className="form-control border-start-0 border-end-0 ps-0" placeholder="Enter your 4-10 digit PIN" maxLength={10} value={form.pin} onChange={handleChange} />
                            <button className="input-group-text bg-white border-start-0 text-muted" onClick={() => setShowPin(!showPin)} type="button" style={{ cursor: 'pointer' }}>
                                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <small className="text-muted mt-1 d-block">This is your transaction PIN, not your login password</small>
                    </div>

                    <div className="mb-5">
                        <label className="form-label text-dark small mb-1">Note (Optional)</label>
                        <div className="input-group align-items-start">
                            <span className="input-group-text bg-white border-end-0 text-muted pt-2 border-primary" style={{ borderWidth: '2px 0 2px 2px' }}><MessageSquare size={16} /></span>
                            <textarea name="note" className="form-control border-start-0 ps-0 border-primary" rows="4" placeholder="Optional payment description or note" value={form.note} onChange={handleChange} style={{ borderWidth: '2px 2px 2px 0' }} />
                        </div>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-7">
                            <button type="submit" disabled={loading} className="btn w-100 py-3 fw-bold text-white d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: '#6c8cf8', border: 'none', borderRadius: '10px' }}>
                                <Send size={18} /> {loading ? 'Submitting...' : 'Continue to Transfer'}
                            </button>
                        </div>
                        <div className="col-md-5">
                            <button type="button" onClick={() => navigate('/dashboard')} className="btn w-100 py-3 fw-bold bg-white d-flex align-items-center justify-content-center gap-2" style={{ border: '1px solid #dee2e6', borderRadius: '10px' }}>
                                <ArrowLeft size={18} /> Back to Dashboard
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="d-flex align-items-center gap-3 px-4 py-3 rounded-3 border" style={{ backgroundColor: '#f8f9fa' }}>
                <ShieldCheck size={22} className="text-primary flex-shrink-0" />
                <div>
                    <span className="fw-semibold text-dark">Secure Transaction</span>
                    <p className="mb-0 text-muted small">All transfers are encrypted and processed securely. Never share your PIN with anyone.</p>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-5 pt-3 border-top text-muted small">
                <div>&copy; 2026 Finora. All rights reserved.</div>
                <div className="d-flex gap-3">
                    <Link to="/privacy" className="text-muted text-decoration-none">Privacy Policy</Link>
                    <Link to="/terms" className="text-muted text-decoration-none">Terms of Service</Link>
                    <Link to="/dashboard/support" className="text-muted text-decoration-none">Contact Support</Link>
                </div>
            </div>
        </div>
    );
};

export default CashAppTransferPage;



