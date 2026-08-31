import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { History, Filter, Download, Search, FileQuestion, Plus } from 'lucide-react';
import { apiRequest } from '../../lib/api';

const LoanHistoryPage = () => {
    const navigate = useNavigate();
    const [loanApplications, setLoanApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadApplications = async () => {
            try {
                const response = await apiRequest('loan-applications');
                setLoanApplications(response.loan_applications || []);
            } catch (error) {
                console.error('Failed to load loan applications:', error);
                setLoanApplications([]);
            } finally {
                setLoading(false);
            }
        };

        loadApplications();
    }, []);

    const filteredApplications = useMemo(() => {
        if (!searchTerm.trim()) return loanApplications;

        const term = searchTerm.toLowerCase();
        return loanApplications.filter((loan) => {
            return (
                (loan.credit_facility || '').toLowerCase().includes(term) ||
                (loan.loan_purpose || '').toLowerCase().includes(term) ||
                (String(loan.loan_amount || '')).includes(term)
            );
        });
    }, [loanApplications, searchTerm]);

    return (
        <div className="dashboard-content w-100 pb-5">
            {/* Title & breadcrumb */}
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Loan History</h3>
                <div className="text-muted small">
                    <Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-dark">Loan History</span>
                </div>
            </div>

            {/* Main Card */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden" style={{ backgroundColor: '#fdfcfe' }}>

                {/* Banner Header */}
                <div
                    className="position-relative p-4 d-flex justify-content-between align-items-center flex-wrap gap-3"
                    style={{ background: 'linear-gradient(135deg, #023888 0%, #1a56db 100%)' }}
                >
                    {/* Waves Background */}
                    <div className="position-absolute w-100 h-100" style={{ bottom: 0, left: 0, opacity: 0.2, top: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                        <svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '100%', position: 'absolute', bottom: '-20px' }}>
                            <path d="M0,40 C300,80 600,0 900,40 C1050,60 1150,30 1200,40 L1200,120 L0,120 Z" fill="white" />
                        </svg>
                    </div>

                    <div className="d-flex align-items-center gap-3 position-relative z-1">
                        <div
                            className="d-flex align-items-center justify-content-center rounded-circle"
                            style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.2)' }}
                        >
                            <History size={24} color="#fff" />
                        </div>
                        <div>
                            <h5 className="fw-bold text-white mb-1">Your Loan Applications</h5>
                            <p className="text-white-50 small mb-0">Track and manage your loan requests</p>
                        </div>
                    </div>

                    <div className="d-flex gap-2 position-relative z-1">
                        <button className="btn btn-sm text-white d-flex align-items-center gap-2 px-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px' }}>
                            <Filter size={16} /> Filter
                        </button>
                        <button className="btn btn-sm text-white d-flex align-items-center gap-2 px-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px' }}>
                            <Download size={16} /> Export
                        </button>
                    </div>
                </div>

                <div className="p-4 p-md-5">
                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted" style={{ borderRadius: '8px 0 0 8px' }}>
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                className="form-control border-start-0 ps-0 py-2"
                                placeholder="Search by loan purpose or amount..."
                                style={{ borderRadius: '0 8px 8px 0', boxShadow: 'none' }}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5 text-muted">Loading loan applications...</div>
                    ) : filteredApplications.length === 0 ? (
                        <div className="text-center py-5 my-4">
                            <div
                                className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
                                style={{ width: '64px', height: '64px', backgroundColor: '#f1f3f5' }}
                            >
                                <FileQuestion size={32} className="text-muted" />
                            </div>
                            <h5 className="fw-bold text-dark mb-2">No loan applications found</h5>
                            <p className="text-muted small mb-4">Try adjusting your search or filter criteria</p>
                            <button
                                onClick={() => navigate('/dashboard/loan/apply')}
                                className="btn btn-primary fw-bold px-4 py-2 d-inline-flex align-items-center gap-2"
                                style={{ borderRadius: '8px', backgroundColor: '#0047a5', border: 'none' }}
                            >
                                <Plus size={18} /> Apply for a Loan
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Table Header */}
                            <div className="d-none d-md-flex text-muted small fw-bold px-3 py-3 mb-4 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                                <div className="col-2">TYPE</div>
                                <div className="col-2">AMOUNT</div>
                                <div className="col-2">PURPOSE</div>
                                <div className="col-2">DURATION</div>
                                <div className="col-2">STATUS</div>
                                <div className="col-2 text-end">DATE APPLIED</div>
                            </div>

                            {filteredApplications.map((loan) => (
                                <div key={loan.id} className="d-flex flex-column flex-md-row align-items-md-center px-3 py-3 mb-3 border rounded-3 bg-white" style={{ gap: '0.5rem' }}>
                                    <div className="col-12 col-md-2 fw-semibold text-dark">{loan.credit_facility || 'N/A'}</div>
                                    <div className="col-12 col-md-2 text-muted">${Number(loan.loan_amount || 0).toLocaleString()}</div>
                                    <div className="col-12 col-md-2 text-muted">{loan.loan_purpose || 'N/A'}</div>
                                    <div className="col-12 col-md-2 text-muted">{loan.loan_duration_months || 0} months</div>
                                    <div className="col-12 col-md-2">
                                        <span className="badge rounded-pill px-3 py-2" style={{
                                            backgroundColor: loan.status === 'approved' ? '#e8fdf0' : loan.status === 'rejected' ? '#ffe9ea' : '#eef3ff',
                                            color: loan.status === 'approved' ? '#198754' : loan.status === 'rejected' ? '#dc3545' : '#0047a5',
                                            textTransform: 'capitalize',
                                        }}>
                                            {loan.status || 'pending'}
                                        </span>
                                    </div>
                                    <div className="col-12 col-md-2 text-md-end text-muted">
                                        {loan.created_at ? new Date(loan.created_at).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

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

export default LoanHistoryPage;



