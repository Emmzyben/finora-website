import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Bitcoin, ShieldCheck, MoreHorizontal } from 'lucide-react';

const transferMethods = [
    {
        id: 'wire',
        icon: <Globe size={30} color="#6c8cf8" />,
        label: 'Wire Transfer',
        desc: 'Transfer funds directly to international bank accounts.',
        bg: '#e8eeff',
        route: '/dashboard/internationaltransfer/wire',
    },
    {
        id: 'crypto',
        icon: <Bitcoin size={30} color="#f7931a" />,
        label: 'Cryptocurrency',
        desc: 'Send funds to your cryptocurrency wallet.',
        bg: '#fff4e5',
        route: '/dashboard/internationaltransfer/crypto',
    },
    {
        id: 'paypal',
        icon: (
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
                <circle cx="12" cy="12" r="12" fill="#003087" />
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">P</text>
            </svg>
        ),
        label: 'PayPal',
        desc: 'Transfer funds to your PayPal account.',
        bg: '#e5eeff',
        route: '/dashboard/internationaltransfer/paypal',
    },
    {
        id: 'wise',
        icon: (
            <svg viewBox="0 0 24 24" width="30" height="30">
                <circle cx="12" cy="12" r="12" fill="#9fe870" />
                <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fill="#1a1a1a" fontSize="13" fontWeight="bold">W</text>
            </svg>
        ),
        label: 'Wise Transfer',
        desc: 'Transfer with lower fees using Wise.',
        bg: '#f0fce8',
        route: '/dashboard/internationaltransfer/wise',
    },
    {
        id: 'cashapp',
        icon: (
            <svg viewBox="0 0 24 24" width="30" height="30">
                <circle cx="12" cy="12" r="12" fill="#00d64f" />
                <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">$</text>
            </svg>
        ),
        label: 'Cash App',
        desc: 'Quick transfers to your Cash App account.',
        bg: '#e5fdf0',
        route: '/dashboard/internationaltransfer/cashapp',
    },
    {
        id: 'more',
        icon: <MoreHorizontal size={30} color="#e0b800" />,
        label: 'More Options',
        desc: 'Zelle, Venmo, Revolut, and more.',
        bg: '#fffbe5',
        isMoreToggle: true,
    },
];

const additionalMethods = [
    {
        id: 'skrill',
        icon: <span className="fw-bold" style={{ color: '#8b2046', fontSize: '18px' }}>Sk</span>,
        label: 'Skrill',
        desc: 'Transfer funds to your Skrill account.',
        bg: '#fff',
        route: '/dashboard/internationaltransfer/skrill',
    },
    {
        id: 'venmo',
        icon: <span className="fw-bold" style={{ color: '#008cff', fontSize: '18px' }}>V</span>,
        label: 'Venmo',
        desc: 'Send funds to your Venmo account.',
        bg: '#fff',
        route: '/dashboard/internationaltransfer/venmo',
    },
    {
        id: 'zelle',
        icon: <span className="fw-bold" style={{ color: '#7118A4', fontSize: '18px' }}>Z</span>,
        label: 'Zelle',
        desc: 'Quick transfers to your Zelle account.',
        bg: '#fff',
        route: '/dashboard/internationaltransfer/zelle',
    },
    {
        id: 'revolut',
        icon: <span className="fw-bold fs-5">R</span>,
        label: 'Revolut',
        desc: 'Transfer to your Revolut account with low fees.',
        bg: '#fff',
        route: '/dashboard/internationaltransfer/revolut',
    },
    {
        id: 'alipay',
        icon: <span className="fw-bold text-primary">支</span>,
        label: 'Alipay',
        desc: 'Send funds to your Alipay account.',
        bg: '#fff',
        route: '/dashboard/internationaltransfer/alipay',
    },
    {
        id: 'wechat',
        icon: <span className="fw-bold text-success">We</span>,
        label: 'WeChat Pay',
        desc: 'Transfer to your WeChat Pay wallet.',
        bg: '#fff',
        route: '/dashboard/internationaltransfer/wechatpay',
    },
];

const InternationalWirePage = () => {
    const navigate = useNavigate();
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    return (
        <div className="dashboard-content w-100 pb-5">
            {/* Title & breadcrumb */}
            <div className="mb-4">
                <h3 className="fw-bold mb-1">International Transfer</h3>
                <div className="text-muted small">
                    <Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-dark">International Transfer</span>
                </div>
            </div>

            {/* Transfer Method Selection */}
            <div className="card border-0 shadow-sm rounded-3 p-4 mb-4">
                <h5 className="fw-bold mb-4">Select Transfer Method</h5>
                <div className="row g-3 mb-4">
                    {transferMethods.map((method) => (
                        <div key={method.id} className="col-md-4">
                            <div
                                onClick={() => {
                                    if (method.isMoreToggle) {
                                        setShowMoreOptions(!showMoreOptions);
                                    } else if (method.route) {
                                        navigate(method.route);
                                    }
                                }}
                                className={`card h-100 p-3 border ${method.isMoreToggle && showMoreOptions ? 'border-primary' : ''}`}
                                style={{
                                    cursor: method.route || method.isMoreToggle ? 'pointer' : 'default',
                                    borderRadius: '12px',
                                    borderColor: method.isMoreToggle && showMoreOptions ? '#0d6efd' : '#e5e4e7',
                                    transition: 'all 0.2s ease',
                                    opacity: method.route || method.isMoreToggle ? 1 : 0.6,
                                }}
                                onMouseEnter={e => { if (method.route || method.isMoreToggle) { e.currentTarget.style.borderColor = '#0d6efd'; e.currentTarget.style.backgroundColor = '#f5f8ff'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(13,110,253,0.12)'; } }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = (method.isMoreToggle && showMoreOptions) ? '#0d6efd' : '#e5e4e7'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div className="d-flex align-items-center gap-3 mb-2">
                                    <div
                                        className="d-flex justify-content-center align-items-center rounded-circle flex-shrink-0"
                                        style={{ width: '48px', height: '48px', backgroundColor: method.bg }}
                                    >
                                        {method.icon}
                                    </div>
                                    <h6 className="mb-0 fw-bold">{method.label}</h6>
                                </div>
                                <p className="text-muted mb-0 small">{method.desc}</p>
                                {!method.route && !method.isMoreToggle && (
                                    <span className="badge mt-2" style={{ backgroundColor: '#f1f3f5', color: '#adb5bd', fontSize: '0.7rem' }}>Coming Soon</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {showMoreOptions && (
                    <div className="mb-4">
                        <div className="d-flex align-items-center gap-2 mb-3 mt-2">
                            <button
                                onClick={() => setShowMoreOptions(false)}
                                className="btn btn-sm d-flex align-items-center justify-content-center p-0"
                                style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f8f9fa', border: '1px solid #e5e4e7' }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            </button>
                            <h6 className="fw-bold mb-0 text-dark">Additional Transfer Methods</h6>
                        </div>
                        <div className="row g-3">
                            {additionalMethods.map((method) => (
                                <div key={method.id} className="col-md-4">
                                    <div
                                        onClick={() => method.route && navigate(method.route)}
                                        className="card h-100 p-3 border"
                                        style={{
                                            cursor: 'pointer',
                                            borderRadius: '12px',
                                            borderColor: '#e5e4e7',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#0d6efd'; e.currentTarget.style.backgroundColor = '#f5f8ff'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(13,110,253,0.12)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e4e7'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <div className="d-flex align-items-center gap-3 mb-2">
                                            <div
                                                className="d-flex justify-content-center align-items-center rounded-circle flex-shrink-0 border"
                                                style={{ width: '40px', height: '40px', backgroundColor: method.bg, borderColor: '#f1f3f5' }}
                                            >
                                                {method.icon}
                                            </div>
                                            <h6 className="mb-0 fw-bold">{method.label}</h6>
                                        </div>
                                        <p className="text-muted mb-0 small">{method.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Secure notice */}
                <div className="d-flex align-items-center gap-3 px-4 py-3 rounded-3 border" style={{ backgroundColor: '#f8f9fa' }}>
                    <ShieldCheck size={20} className="text-primary flex-shrink-0" />
                    <div>
                        <span className="fw-semibold text-dark">Secure Transaction</span>
                        <p className="mb-0 text-muted small">All transfers are encrypted and processed securely. Never share your PIN with anyone.</p>
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

export default InternationalWirePage;



