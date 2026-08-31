import React, { useEffect, useState } from 'react';
import { Filter, Download, Search, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest, getAuthToken } from '../../lib/api';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const result = await apiRequest('transactions');
                setTransactions(result.transactions || []);
            } catch (error) {
                console.error('Transactions load failed', error);
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        if (getAuthToken()) {
            loadTransactions();
        } else {
            setLoading(false);
        }
    }, []);

    const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

    return (
        <div className="dashboard-content w-100">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h3 className="fw-bold mb-1">Transactions</h3>
                    <div className="text-muted small">
                        <Link to="/dashboard" className="text-muted text-decoration-none hover-primary">Dashboard</Link>
                        <span className="mx-2">&gt;</span>
                        <span className="text-dark">Transactions</span>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary bg-white d-flex align-items-center px-3" style={{ border: '1px solid #e5e4e7' }}>
                        <Filter size={16} className="me-2 text-muted" /> Filter
                    </button>
                    <button className="btn btn-primary d-flex align-items-center px-3" style={{ backgroundColor: '#023888', border: 'none' }}>
                        <Download size={16} className="me-2" /> Export
                    </button>
                </div>
            </div>

            <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '12px' }}>
                <div className="card-body p-0">
                    <div className="p-3 border-bottom d-flex align-items-center">
                        <Search size={18} className="text-muted me-2" />
                        <input
                            type="text"
                            className="form-control border-0 shadow-none bg-transparent p-0"
                            placeholder="Search by transaction reference..."
                        />
                    </div>

                    <div className="table-responsive">
                        <table className="table mb-0">
                            <thead className="bg-light text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                <tr>
                                    <th className="fw-semibold py-3 ps-4 border-bottom-0">AMOUNT</th>
                                    <th className="fw-semibold py-3 border-bottom-0">TYPE</th>
                                    <th className="fw-semibold py-3 border-bottom-0">STATUS</th>
                                    <th className="fw-semibold py-3 border-bottom-0">REFERENCE ID</th>
                                    <th className="fw-semibold py-3 border-bottom-0">DESCRIPTION</th>
                                    <th className="fw-semibold py-3 border-bottom-0">SCOPE</th>
                                    <th className="fw-semibold py-3 border-bottom-0">CREATED</th>
                               </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5 text-muted">
                                            Loading transactions...
                                        </td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5">
                                            <div className="py-4">
                                                <div className="d-inline-flex justify-content-center align-items-center mb-3 text-muted">
                                                    <Inbox size={64} strokeWidth={1} style={{ opacity: 0.5 }} />
                                                </div>
                                                <h5 className="fw-bold mb-2">No transactions found</h5>
                                                <p className="text-muted mb-0">Try adjusting your search or filter parameters</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((item) => (
                                        <tr key={item.id}>
                                            <td className="py-3 ps-4 fw-semibold">{formatCurrency(item.amount)}</td>
                                            <td className="py-3 text-capitalize">{item.transaction_type || 'transfer'}</td>
                                            <td className="py-3">
                                                <span className={`badge ${item.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                    {item.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="py-3">{item.reference_id || item.id}</td>
                                            <td className="py-3">{item.description || 'No description'}</td>
                                            <td className="py-3 text-capitalize">{item.scope || 'wallet'}</td>
                                            <td className="py-3">{item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}</td>
                                          
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top text-muted small">
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

export default TransactionsPage;



