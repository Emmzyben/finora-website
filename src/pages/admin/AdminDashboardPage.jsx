import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, getAuthToken, clearAuth } from '../../lib/api';
import { ArrowUpRight, CheckCircle2, CreditCard, DollarSign, FileText, ShieldCheck, UserRound, Wallet, LogOut, LayoutDashboard } from 'lucide-react';
const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
}).format(Number(value || 0));

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState({
        pending_deposits: 0,
        pending_transfers: 0,
        pending_loans: 0,
        pending_cards: 0,
        total_users: 0,
        total_balance: 0,
        admin_name: 'Admin',
    });
    const [requests, setRequests] = useState({ deposits: [], loans: [], cards: [], transfers: [], users: [] });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadData = async () => {
        try {
            const [summary, deposits, loans, cards, transfers, users] = await Promise.all([
                apiRequest('admin-dashboard'),
                apiRequest('admin-deposit-requests', { method: 'GET' }),
                apiRequest('admin-loan-applications', { method: 'GET' }),
                apiRequest('admin-card-requests', { method: 'GET' }),
                apiRequest('admin-transfer-requests', { method: 'GET' }),
                apiRequest('admin-users', { method: 'GET' }),
            ]);

            setDashboard(summary.dashboard || dashboard);
            setRequests({
                deposits: deposits.requests || [],
                loans: loans.applications || [],
                cards: cards.cards || [],
                transfers: transfers.transactions || [],
                users: users.users || [],
            });
        } catch (err) {
            setError(err.message || 'Unable to load admin dashboard.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (getAuthToken()) {
            loadData();
        } else {
            setLoading(false);
        }
    }, []);

    const handleApprove = async (action, id) => {
        try {
            setMessage('');
            setError('');
            const result = await apiRequest(action, { method: 'POST', body: { id } });
            setMessage(result.message || 'Action completed.');
            await loadData();
        } catch (err) {
            setError(err.message || 'Action failed.');
        }
    };

    const handleBalanceUpdate = async (userId) => {
        const amount = window.prompt('Enter amount to add or subtract from this user balance (e.g. 200 or -200):');
        if (amount === null || amount === '') return;

        const parsed = Number(amount);
        if (!Number.isFinite(parsed) || parsed === 0) {
            setError('Please enter a valid non-zero number.');
            return;
        }

        const direction = parsed > 0 ? 'credit' : 'debit';

        try {
            setMessage('');
            setError('');
            const result = await apiRequest('admin-update-balance', {
                method: 'POST',
                body: { user_id: userId, amount: Math.abs(parsed), direction },
            });
            setMessage(result.message || 'Balance updated.');
            await loadData();
        } catch (err) {
            setError(err.message || 'Balance update failed.');
        }
    };

    const handleLogout = () => {
        clearAuth();
        navigate('/sign-in');
    };

    const renderRows = (items, type) => {
        if (!Array.isArray(items) || items.length === 0) {
            return (
                <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No {type} found</td>
                </tr>
            );
        }

        return items.slice(0, 5).map((item) => {
            if (type === 'deposits') {
                return (
                    <tr key={item.id}>
                        <td>{item.first_name || item.username || 'User'}</td>
                        <td>{formatCurrency(item.amount)}</td>
                        <td>{item.payment_method}</td>
                        <td>{item.status}</td>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                        <td>
                            <button className="btn btn-sm btn-success" onClick={() => handleApprove('admin-approve-deposit', item.id)}>
                                Approve
                            </button>
                        </td>
                    </tr>
                );
            }

            if (type === 'loans') {
                return (
                    <tr key={item.id}>
                        <td>{item.first_name || item.username || 'User'}</td>
                        <td>{formatCurrency(item.loan_amount)}</td>
                        <td>{item.credit_facility}</td>
                        <td>{item.status}</td>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                        <td>
                            <button className="btn btn-sm btn-success" onClick={() => handleApprove('admin-approve-loan', item.id)}>
                                Approve
                            </button>
                        </td>
                    </tr>
                );
            }

            if (type === 'cards') {
                return (
                    <tr key={item.id}>
                        <td>{item.first_name || item.username || 'User'}</td>
                        <td>{item.card_type}</td>
                        <td>{item.card_level}</td>
                        <td>{item.status}</td>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                        <td>
                            <button className="btn btn-sm btn-success" onClick={() => handleApprove('admin-approve-card', item.id)}>
                                Approve
                            </button>
                        </td>
                    </tr>
                );
            }

            if (type === 'transfers') {
                return (
                    <tr key={item.id}>
                        <td>{item.first_name || item.username || 'User'}</td>
                        <td>{formatCurrency(item.amount)}</td>
                        <td>{item.transaction_type}</td>
                        <td>{item.status}</td>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                        <td>
                            <button className="btn btn-sm btn-success" onClick={() => handleApprove('admin-approve-transfer', item.id)}>
                                Approve
                            </button>
                        </td>
                    </tr>
                );
            }

            return (
                <tr key={item.id}>
                    <td>{item.first_name || item.username || item.email || 'User'}</td>
                    <td>{item.email}</td>
                    <td>{formatCurrency(item.balance)}</td>
                    <td>{item.is_admin ? 'Admin' : 'User'}</td>
                    <td>{item.account_number || 'N/A'}</td>
                    <td>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleBalanceUpdate(item.id)}>
                            Adjust balance
                        </button>
                    </td>
                </tr>
            );
        });
    };

    return (
        <div className="min-vh-100 bg-light font-sans">
            {/* Top Navigation */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container-fluid px-3 py-1">
                    <a className="navbar-brand d-flex align-items-center fw-bold fs-5" href="#">
                        <ShieldCheck size={20} className="me-2 text-warning" />
                        Finora Admin
                    </a>
                    <div className="d-flex align-items-center">
                        <div className="text-white me-3 d-none d-md-block text-end">
                            <span className="opacity-75 small d-block" style={{ fontSize: '0.75rem', lineHeight: '1' }}>Admin</span>
                            <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{dashboard.admin_name}</span>
                        </div>
                        <button onClick={handleLogout} className="btn btn-outline-light btn-sm d-flex align-items-center px-2 py-1 transition-all">
                            <LogOut size={14} className="me-1" /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container-fluid px-4 py-4">
                {message && <div className="alert alert-success shadow-sm rounded">{message}</div>}
                {error && <div className="alert alert-danger shadow-sm rounded">{error}</div>}

                {loading ? (
                    <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '50vh' }}>
                        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm rounded bg-white h-100">
                                    <div className="card-body p-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Pending Deposits</span>
                                            <Wallet size={20} className="text-primary" />
                                        </div>
                                        <h3 className="fw-bold text-dark mb-0">{dashboard.pending_deposits}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm rounded bg-white h-100">
                                    <div className="card-body p-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Pending Transfers</span>
                                            <ArrowUpRight size={20} className="text-success" />
                                        </div>
                                        <h3 className="fw-bold text-dark mb-0">{dashboard.pending_transfers}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm rounded bg-white h-100">
                                    <div className="card-body p-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Pending Loans</span>
                                            <FileText size={20} className="text-warning" />
                                        </div>
                                        <h3 className="fw-bold text-dark mb-0">{dashboard.pending_loans}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm rounded bg-white h-100">
                                    <div className="card-body p-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Card Requests</span>
                                            <CreditCard size={20} className="text-info" />
                                        </div>
                                        <h3 className="fw-bold text-dark mb-0">{dashboard.pending_cards}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tables Grid */}
                        <div className="row g-4 mb-4">
                            <div className="col-xl-6">
                                <div className="card border-0 shadow-sm rounded bg-white h-100">
                                    <div className="card-header bg-white border-bottom py-2 px-3 d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0 fw-bold">Pending Deposits</h6>
                                        <span className="badge bg-light text-dark border">{requests.deposits.length}</span>
                                    </div>
                                    <div className="table-responsive p-2" style={{ fontSize: '0.9rem' }}>
                                        <table className="table table-hover table-sm mb-0 align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>User</th>
                                                    <th>Amount</th>
                                                    <th>Method</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="border-top-0">{renderRows(requests.deposits, 'deposits')}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-6">
                                <div className="card border-0 shadow-sm rounded bg-white h-100">
                                    <div className="card-header bg-white border-bottom py-2 px-3 d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0 fw-bold">Pending Loans</h6>
                                        <span className="badge bg-light text-dark border">{requests.loans.length}</span>
                                    </div>
                                    <div className="table-responsive p-2" style={{ fontSize: '0.9rem' }}>
                                        <table className="table table-hover table-sm mb-0 align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>User</th>
                                                    <th>Amount</th>
                                                    <th>Facility</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="border-top-0">{renderRows(requests.loans, 'loans')}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-6">
                                <div className="card border-0 shadow-sm rounded bg-white h-100">
                                    <div className="card-header bg-white border-bottom py-2 px-3 d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0 fw-bold">Card Requests</h6>
                                        <span className="badge bg-light text-dark border">{requests.cards.length}</span>
                                    </div>
                                    <div className="table-responsive p-2" style={{ fontSize: '0.9rem' }}>
                                        <table className="table table-hover table-sm mb-0 align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>User</th>
                                                    <th>Type</th>
                                                    <th>Level</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="border-top-0">{renderRows(requests.cards, 'cards')}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-6">
                                <div className="card border-0 shadow-sm rounded bg-white h-100">
                                    <div className="card-header bg-white border-bottom py-2 px-3 d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0 fw-bold">Pending Transfers</h6>
                                        <span className="badge bg-light text-dark border">{requests.transfers.length}</span>
                                    </div>
                                    <div className="table-responsive p-2" style={{ fontSize: '0.9rem' }}>
                                        <table className="table table-hover table-sm mb-0 align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>User</th>
                                                    <th>Amount</th>
                                                    <th>Type</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="border-top-0">{renderRows(requests.transfers, 'transfers')}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="col-12 mt-2">
                                <div className="card border-0 shadow-sm rounded bg-white">
                                    <div className="card-header bg-white border-bottom py-3 px-3 d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0 fw-bold">User Management</h6>
                                        <div className="d-flex align-items-center gap-3 text-muted" style={{ fontSize: '0.85rem' }}>
                                            <span><strong>{dashboard.total_users}</strong> Users</span>
                                            <span><strong>{formatCurrency(dashboard.total_balance)}</strong> Total Balance</span>
                                        </div>
                                    </div>
                                    <div className="table-responsive p-2" style={{ fontSize: '0.9rem' }}>
                                        <table className="table table-hover table-sm mb-0 align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>User</th>
                                                    <th>Email</th>
                                                    <th>Balance</th>
                                                    <th>Role</th>
                                                    <th>Account</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="border-top-0">{renderRows(requests.users, 'users')}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
