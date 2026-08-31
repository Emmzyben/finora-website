import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff, MessageSquare, Send, ShieldCheck, Copy, AlertTriangle, Bitcoin, Building2 } from 'lucide-react';
import { apiRequest } from '../../lib/api';

const cryptos = [
    { id: 'BTC', name: 'Bitcoin (BTC)', network: 'Native', icon: <Bitcoin size={24} color="#fff" />, color: '#f7931a', bg: '#fff4e5' },
    {
        id: 'ETH', name: 'Ethereum (ETH)', network: 'ERC20', icon: (
            <svg viewBox="0 0 32 32" width="24" height="24">
                <path d="M15.925 23.969l-9.819-5.794 9.819 13.781 9.825-13.781z" fill="#fff" />
                <path d="M15.925 0l-9.819 16.3 9.819 5.794 9.825-5.794z" fill="#fff" />
            </svg>
        ), color: '#627eea', bg: '#f0f3ff'
    },
    {
        id: 'USDT', name: 'Tether (USDT)', network: 'TRC20', icon: (
            <svg viewBox="0 0 32 32" width="24" height="24">
                <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm.32-15.541v9.845h-3.411v-9.826c-3.791-.252-6.527-1.428-6.527-2.822 0-1.421 2.82-2.617 6.702-2.853v-2.529h3.236v2.518c3.743.275 6.425 1.442 6.425 2.836 0 1.36-2.64 2.511-6.425 2.831zm0-3.195v-1.125c-3.123.23-5.328 1.053-5.328 2.052 0 .991 2.205 1.822 5.328 2.061v-2.988zm-3.411 0v2.988c-3.11-.237-5.3-1.066-5.3-2.056 0-1.002 2.19-1.83 5.3-2.061v1.129z" fill="#fff" />
            </svg>
        ), color: '#26a17b', bg: '#e9f5f1'
    },
    {
        id: 'BNB', name: 'BNB', network: 'BEP20', icon: (
            <svg viewBox="0 0 32 32" width="24" height="24">
                <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm-5.06-16l5.06-5.06 5.06 5.06-2.15 2.15-2.91-2.91-2.91 2.91zM16 7.28L8.68 14.6 6.53 12.45 16 2.97l9.47 9.47-2.15 2.15zM23.32 17.4l2.15-2.15L29.47 19l-9.47 9.47-9.47-9.47 4.02-4.02 2.91 2.91-2.91 2.91 5.45 5.45 5.45-5.45-2.91-2.91z" fill="#fff" />
            </svg>
        ), color: '#f3ba2f', bg: '#fff8e7'
    },
];

const CryptoTransferPage = () => {
    const navigate = useNavigate();
    const [showPin, setShowPin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({
        amount: '0.00',
        wallet_address: '',
        network: 'Native',
        note: '',
        pin: '',
    });
    const [selectedCrypto, setSelectedCrypto] = useState(cryptos[0]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.wallet_address || !form.pin || Number(form.amount) <= 0) {
            setMessage('Please provide a wallet address, amount, and transaction PIN.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await apiRequest('transfer', {
                method: 'POST',
                body: {
                    transfer_type: 'crypto_transfer',
                    method: 'crypto_transfer',
                    amount: Number(form.amount),
                    currency: 'USD',
                    recipient_name: selectedCrypto.name,
                    recipient_account: form.wallet_address,
                    description: form.note || 'Crypto transfer',
                    network: form.network || selectedCrypto.network,
                    coin: selectedCrypto.id,
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
                        {selectedCrypto.icon}
                    </div>
                    <h4 className="fw-bold text-white mb-2">Cryptocurrency Withdrawal</h4>
                    <p className="text-white-50 mb-0">Withdrawals are typically processed within 1-3 hours.</p>
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

                    <div className="d-flex align-items-center gap-3 p-3 rounded-3 mb-4 mx-auto" style={{ backgroundColor: '#fafafa', border: '1px solid #eee', maxWidth: '400px' }}>
                        <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: '40px', height: '40px', backgroundColor: selectedCrypto.color }}>
                            {selectedCrypto.icon}
                        </div>
                        <div>
                            <div className="fw-bold text-dark">{selectedCrypto.id} {selectedCrypto.network}</div>
                            <div className="text-muted small">Select your preferred cryptocurrency and network</div>
                        </div>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="form-label text-dark small mb-1">Cryptocurrency</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0 text-muted"><Building2 size={16} style={{ opacity: 0 }} /><div className="position-absolute start-0 ms-3">🏛️</div></span>
                                <select className="form-select border-start-0 ps-1" value={selectedCrypto.id} onChange={(e) => {
                                    const next = cryptos.find((c) => c.id === e.target.value);
                                    setSelectedCrypto(next);
                                    setForm((prev) => ({ ...prev, network: next.network }));
                                }}>
                                    {cryptos.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label text-dark small mb-1">Network</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0 text-muted"><div className="position-absolute start-0 ms-3">⛓️</div></span>
                                <select name="network" className="form-select border-start-0 ps-1" value={form.network} onChange={handleChange}>
                                    <option value="Native">Native</option>
                                    <option value="ERC20">ERC20</option>
                                    <option value="TRC20">TRC20</option>
                                    <option value="BEP20">BEP20</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-4">
                        {cryptos.map((crypto) => (
                            <div className="col-6 col-md-3" key={crypto.id}>
                                <button type="button" onClick={() => setSelectedCrypto(crypto)} className="btn w-100 d-flex flex-column align-items-center justify-content-center py-3 border" style={{ backgroundColor: selectedCrypto.id === crypto.id ? '#6c8cf8' : '#fff', borderColor: selectedCrypto.id === crypto.id ? '#6c8cf8' : '#e5e4e7', borderRadius: '10px', transition: 'all 0.2s', color: selectedCrypto.id === crypto.id ? '#fff' : '#495057' }}>
                                    <div className="d-flex align-items-center justify-content-center rounded-circle mb-2" style={{ width: '32px', height: '32px', backgroundColor: crypto.color }}>
                                        {crypto.icon}
                                    </div>
                                    <span className="fw-semibold small">{crypto.id}</span>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-dark small mb-1">Wallet Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted"><Copy size={16} style={{ opacity: 0 }} /><div className="position-absolute start-0 ms-3"><Copy size={16} /></div></span>
                            <input type="text" name="wallet_address" className="form-control border-start-0 border-end-0 ps-0" placeholder="Enter wallet address" value={form.wallet_address} onChange={handleChange} />
                            <span className="input-group-text bg-white border-start-0 text-muted"><Copy size={16} /></span>
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-2 p-3 rounded-3 mb-4" style={{ backgroundColor: '#fff8e6', border: '1px solid #ffeeba', color: '#856404' }}>
                        <AlertTriangle size={18} className="flex-shrink-0" />
                        <span className="small">Double-check your wallet address. Transactions to incorrect addresses cannot be reversed.</span>
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

export default CryptoTransferPage;



