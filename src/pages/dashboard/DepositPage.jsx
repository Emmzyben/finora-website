import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PiggyBank, Wallet, Bitcoin, CheckCircle2, ShieldCheck, ArrowLeft, CreditCard } from 'lucide-react';

const DepositPage = () => {
    const navigate = useNavigate();
    const [depositMethod, setDepositMethod] = useState('usdt');
    const [amount, setAmount] = useState('0.00');

    const presetAmounts = [100, 500, 1000, 5000, 10000];

    return (
        <div className="dashboard-content w-100 pb-5">
            {/* Title & breadcrumb */}
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Deposit Funds</h3>
                <div className="text-muted small">
                    <Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-dark">Deposit</span>
                </div>
            </div>

            {/* Hero Banner */}
            <div
                className="card border-0 mb-4 text-white text-center position-relative overflow-hidden"
                style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #023888 0%, #1a56db 100%)', minHeight: '220px' }}
            >
                {/* Decorative circle */}
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
                        <PiggyBank size={32} color="#fff" />
                    </div>
                    <h3 className="fw-bold text-white mb-2">Fund Your Account</h3>
                    <p className="text-white-50 mb-0 fs-6">Choose your preferred deposit method and amount</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="card border-0 shadow-sm rounded-3 p-4 p-md-5 mb-4">

                {/* Select Deposit Method */}
                <div className="mb-4 pb-3 border-bottom">
                    <label className="form-label fw-semibold text-dark mb-3">Select Deposit Method</label>
                    <div className="row g-3">
                        {/* USDT Option */}
                        <div className="col-md-6">
                            <div
                                className={`card p-3 h-100 ${depositMethod === 'usdt' ? 'border-primary' : 'border'}`}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: depositMethod === 'usdt' ? '#f0f5ff' : '#fff',
                                    transition: 'all 0.2s',
                                    borderWidth: depositMethod === 'usdt' ? '2px' : '1px',
                                    borderRadius: '10px'
                                }}
                                onClick={() => setDepositMethod('usdt')}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '40px', height: '40px', backgroundColor: '#e6f8f0' }}>
                                            <Wallet size={20} color="#20c997" />
                                        </div>
                                        <span className="fw-bold fs-6">USDT</span>
                                    </div>
                                    <div className="rounded-circle d-flex align-items-center justify-content-center border" style={{ width: '24px', height: '24px', backgroundColor: depositMethod === 'usdt' ? '#0d6efd' : '#fff', borderColor: depositMethod === 'usdt' ? '#0d6efd' : '#dee2e6' }}>
                                        {depositMethod === 'usdt' && <CheckCircle2 size={16} color="#fff" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bitcoin Option */}
                        <div className="col-md-6">
                            <div
                                className={`card p-3 h-100 ${depositMethod === 'bitcoin' ? 'border-primary' : 'border'}`}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: depositMethod === 'bitcoin' ? '#f0f5ff' : '#fff',
                                    transition: 'all 0.2s',
                                    borderWidth: depositMethod === 'bitcoin' ? '2px' : '1px',
                                    borderRadius: '10px'
                                }}
                                onClick={() => setDepositMethod('bitcoin')}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '40px', height: '40px', backgroundColor: '#fff8e5' }}>
                                            <Bitcoin size={20} color="#f5a623" />
                                        </div>
                                        <span className="fw-bold fs-6">Bitcoin</span>
                                    </div>
                                    <div className="rounded-circle d-flex align-items-center justify-content-center border" style={{ width: '24px', height: '24px', backgroundColor: depositMethod === 'bitcoin' ? '#0d6efd' : '#fff', borderColor: depositMethod === 'bitcoin' ? '#0d6efd' : '#dee2e6' }}>
                                        {depositMethod === 'bitcoin' && <CheckCircle2 size={16} color="#fff" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Amount */}
                <div className="mb-5">
                    <label className="form-label fw-semibold text-dark mb-3">Deposit Amount</label>
                    <div className="d-flex align-items-center px-3 py-2 rounded-3 border mb-3" style={{ borderColor: '#6c8cf8', borderWidth: '2px', backgroundColor: '#f5f8ff' }}>
                        <span className="text-muted fw-bold me-2 fs-5">$</span>
                        <input
                            type="number"
                            className="form-control border-0 shadow-none p-0 fw-bold fs-4 text-dark bg-transparent"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <span className="text-muted">.00</span>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                        {presetAmounts.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                className="btn btn-light border fw-semibold text-muted"
                                style={{ borderRadius: '8px' }}
                                onClick={() => setAmount(preset.toString())}
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="row g-3">
                    <div className="col-md-7">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/deposits/make', {
                                state: {
                                    method: depositMethod,
                                    amount: amount || '0.00',
                                },
                            })}
                            className="btn w-100 py-3 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                            style={{ backgroundColor: '#6c8cf8', border: 'none', borderRadius: '10px' }}
                        >
                            <CreditCard size={18} /> Continue to Deposit
                        </button>
                    </div>
                    <div className="col-md-5">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn w-100 py-3 fw-bold bg-white d-flex align-items-center justify-content-center gap-2"
                            style={{ border: '1px solid #dee2e6', borderRadius: '10px' }}
                        >
                            <ArrowLeft size={18} /> Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* Secure notice */}
            <div className="d-flex align-items-center gap-3 px-4 py-4 rounded-3 border" style={{ backgroundColor: '#fdfcfe', borderColor: '#f1f3f5' }}>
                <div className="d-flex align-items-center justify-content-center flex-shrink-0 bg-white border" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
                    <ShieldCheck size={24} className="text-primary" />
                </div>
                <div>
                    <span className="fw-bold text-dark d-block mb-1">Secure Deposit</span>
                    <p className="mb-0 text-muted small">All deposits are processed through secure payment channels. Your financial information is never stored on our servers.</p>
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

export default DepositPage;



