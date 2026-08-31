import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, CreditCard, UploadCloud, CheckCircle2, Wallet } from 'lucide-react';
import { apiRequest } from '../../lib/api';

const MakeDepositPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedMethod = location.state?.method || 'usdt';
    const selectedAmount = location.state?.amount || '500';
    const [proofFile, setProofFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const paymentLabel = useMemo(() => {
        if (selectedMethod === 'bitcoin') return 'BTC';
        return 'USDT';
    }, [selectedMethod]);

    const networkType = selectedMethod === 'bitcoin' ? 'BTC Network' : 'TRC20';
    const walletAddress = selectedMethod === 'bitcoin'
        ? 'bc1qrp0ljxwl2w7vmhsawvlvawxv7d54q0ua9dqrec'
        : '0xb175E5a797032AB0efef899382aADF217eb72E94';

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] || null;
        setProofFile(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!proofFile) {
            setMessage('Please upload a payment proof file before submitting.');
            return;
        }

        if (!Number(selectedAmount) || Number(selectedAmount) <= 0) {
            setMessage('Please choose a valid deposit amount before submitting.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('amount', String(Number(selectedAmount)));
            formData.append('currency', 'USD');
            formData.append('payment_method', selectedMethod);
            formData.append('payment_label', paymentLabel);
            formData.append('network', networkType);
            formData.append('wallet_address', walletAddress);
            formData.append('proof_file', proofFile);

            await apiRequest('submit-deposit-request', {
                method: 'POST',
                body: formData,
                skipAuth: false,
            });

            navigate('/dashboard/deposits');
        } catch (error) {
            setMessage(error.message || 'Deposit request could not be submitted.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-content w-100 pb-5">
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Make Deposit</h3>
                <div className="text-muted small">
                    <Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link>
                    <span className="mx-2">&gt;</span>
                    <Link to="/dashboard/deposits" className="text-muted text-decoration-none">Deposits</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-dark">Make Payment</span>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4">
                <div className="p-4 p-md-5">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <div>
                            <p className="text-muted small mb-1">Payment Method</p>
                            <h5 className="fw-bold mb-0">{paymentLabel}</h5>
                        </div>
                        <div className="text-end">
                            <p className="text-muted small mb-1">Amount</p>
                            <h5 className="fw-bold mb-0">${Number(selectedAmount || 0).toLocaleString()}</h5>
                        </div>
                    </div>

                    <div className="alert alert-light border mb-4" style={{ backgroundColor: '#f5f8ff' }}>
                        <p className="mb-2 text-dark fw-semibold">Payment Instructions</p>
                        <p className="mb-0 text-muted">
                            You are to make payment of <strong className="text-dark">${Number(selectedAmount || 0).toLocaleString()}</strong> using your selected payment method. Screenshot and upload the proof of payment.
                        </p>
                    </div>

                    <div className="row g-4 align-items-start">
                        <div className="col-lg-5">
                            <div className="card border rounded-4 h-100 p-4">
                                <div className="text-center mb-3">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '64px', height: '64px', backgroundColor: '#e8fdf0' }}>
                                        <Wallet size={28} className="text-success" />
                                    </div>
                                    <h6 className="fw-bold mb-0">Scan QR Code</h6>
                                </div>

                                <div className="d-flex justify-content-center mb-3">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}`}
                                        alt="Payment QR Code"
                                        className="img-fluid rounded-3 border"
                                        style={{ backgroundColor: '#fff', maxWidth: '200px' }}
                                    />
                                </div>

                                <p className="text-muted small text-center mb-4">
                                    Scan the QR code with your payment app
                                </p>

                                <div className="mb-3">
                                    <small className="text-muted d-block mb-1">{paymentLabel} Address</small>
                                    <div className="border rounded-3 p-3 bg-light fw-semibold text-break small">
                                        {walletAddress}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted d-block mb-1">Amount</small>
                                    <div className="border rounded-3 p-3 bg-light fw-semibold">
                                        ${Number(selectedAmount || 0).toLocaleString()}
                                    </div>
                                </div>

                                <div>
                                    <small className="text-muted d-block mb-1">Network Type</small>
                                    <div className="border rounded-3 p-3 bg-light fw-semibold">
                                        {networkType}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-7">
                            <form onSubmit={handleSubmit}>
                                <div className="card border rounded-4 p-4 h-100">
                                    {message && (
                                        <div className="alert alert-danger mb-4" role="alert">{message}</div>
                                    )}

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold text-dark mb-2">Upload Payment Proof</label>
                                        <div className="border border-dashed rounded-4 p-4 text-center" style={{ backgroundColor: '#f8f9fa', borderColor: '#cfd8e3' }}>
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg,application/pdf"
                                                className="d-none"
                                                id="payment-proof"
                                                onChange={handleFileChange}
                                            />
                                            <label htmlFor="payment-proof" className="d-block cursor-pointer">
                                                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '52px', height: '52px', backgroundColor: '#e9efff' }}>
                                                    <UploadCloud size={24} className="text-primary" />
                                                </div>
                                                <div className="fw-semibold text-dark mb-1">Click to upload or drag and drop</div>
                                                <small className="text-muted">PNG, JPG or PDF (max. 5MB)</small>
                                            </label>
                                            {proofFile && (
                                                <div className="mt-3 d-flex align-items-center justify-content-center gap-2 text-success fw-semibold small">
                                                    <CheckCircle2 size={16} />
                                                    {proofFile.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="d-grid gap-3">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn btn-primary py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                                            style={{ borderRadius: '12px' }}
                                        >
                                            <ArrowUpRight size={18} /> {loading ? 'Submitting...' : 'Submit Payment'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => navigate('/dashboard/deposits')}
                                            className="btn btn-light py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                                            style={{ borderRadius: '12px', border: '1px solid #dee2e6' }}
                                        >
                                            <ArrowLeft size={18} /> Back
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MakeDepositPage;
