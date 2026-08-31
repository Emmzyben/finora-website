import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, Calendar, Percent, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiRequest, getCurrentUser } from '../../lib/api';

const InvestmentsPage = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    
    const [plans, setPlans] = useState([]);
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [purchaseAmount, setPurchaseAmount] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [purchasing, setPurchasing] = useState(false);
    const [userBalance, setUserBalance] = useState(user?.balance || 0);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Refresh user balance first
                const meRes = await apiRequest('me');
                if (meRes.user) {
                    setUserBalance(meRes.user.balance || 0);
                }

                // Load investment plans
                const plansRes = await apiRequest('investment-plans');
                setPlans(plansRes.plans || []);

                // Load user investments
                const investmentsRes = await apiRequest('my-investments');
                setInvestments(investmentsRes.investments || []);
            } catch (error) {
                console.error('Error loading investments:', error);
                setMessage('Failed to load investment data. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handlePurchaseClick = (plan) => {
        if (userBalance < plan.minimum_amount) {
            setMessage(`Insufficient balance. You need at least USD ${plan.minimum_amount.toLocaleString()}.`);
            return;
        }
        setSelectedPlan(plan);
        setPurchaseAmount(plan.minimum_amount.toString());
        setMessage('');
    };

    const handlePurchase = async (e) => {
        e.preventDefault();
        
        if (!selectedPlan) return;

        const amount = parseFloat(purchaseAmount);
        if (isNaN(amount) || amount <= 0) {
            setMessage('Please enter a valid investment amount.');
            return;
        }

        if (amount < selectedPlan.minimum_amount) {
            setMessage(`Minimum investment amount is USD ${selectedPlan.minimum_amount.toLocaleString()}.`);
            return;
        }

        if (amount > userBalance) {
            setMessage('Insufficient balance.');
            return;
        }

        setPurchasing(true);
        try {
            await apiRequest('buy-investment', {
                method: 'POST',
                body: {
                    plan_id: selectedPlan.id,
                    amount: amount,
                },
            });

            // Reload data
            const investmentsRes = await apiRequest('my-investments');
            setInvestments(investmentsRes.investments || []);

            const meRes = await apiRequest('me');
            if (meRes.user) {
                setUserBalance(meRes.user.balance);
            }

            setSelectedPlan(null);
            setPurchaseAmount('');
            setMessage('');
        } catch (error) {
            setMessage(error.message || 'Failed to purchase investment.');
        } finally {
            setPurchasing(false);
        }
    };

    const calculateReturn = (investment) => {
        if (investment.status !== 'active') return investment.total_return;
        return investment.principal_amount + investment.current_yield;
    };

    if (loading) {
        return (
            <div className="dashboard-content w-100 pb-5">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-content w-100 pb-5">
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Investment Plans</h3>
                <div className="text-muted small">
                    <Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-dark">Investments</span>
                </div>
            </div>

            {message && (
                <div className={`alert ${message.includes('Failed') ? 'alert-warning' : 'alert-info'} mb-4`} role="alert">
                    {message}
                </div>
            )}

            {/* Current Balance */}
            <div className="card border-0 shadow-sm rounded-3 mb-4 overflow-hidden">
                <div className="card-body p-4 p-md-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <p className="text-white mb-1" style={{ fontSize: '0.9rem', opacity: 0.9 }}>Available Balance</p>
                            <h2 className="text-white fw-bold mb-0" style={{ fontSize: '2.5rem' }}>
                                USD {userBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h2>
                        </div>
                        <DollarSign size={48} className="text-white" style={{ opacity: 0.3 }} />
                    </div>
                </div>
            </div>

            {/* Active Investments */}
            {investments.length > 0 ? (
                <div className="card border-0 shadow-sm rounded-3 mb-4 overflow-hidden">
                    <div className="card-body p-4 p-md-5">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <TrendingUp size={20} className="text-primary" />
                            Your Active Investments
                        </h5>
                        
                        <div className="row g-3">
                            {investments.map((investment) => (
                                <div key={investment.id} className="col-md-6 col-lg-4">
                                    <div className="border rounded-3 p-4" style={{ background: '#f8f9fa' }}>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h6 className="fw-bold mb-1 text-capitalize">{investment.plan_type} Plan</h6>
                                                <small className="text-muted">Status: <span className={`badge ${investment.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{investment.status}</span></small>
                                            </div>
                                            <CheckCircle2 size={20} className="text-success" />
                                        </div>

                                        <div className="mb-3">
                                            <p className="mb-2 small text-muted">Principal Amount</p>
                                            <h5 className="fw-bold text-dark">
                                                ${investment.principal_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </h5>
                                        </div>

                                        <div className="mb-3 pb-3" style={{ borderBottom: '1px solid #dee2e6' }}>
                                            <p className="mb-2 small text-muted">Current Yield</p>
                                            <h5 className="fw-bold text-success">
                                                ${investment.current_yield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </h5>
                                            <small className="text-muted">
                                                {investment.daily_interest_rate}% daily for {investment.days_elapsed || 0} days
                                            </small>
                                        </div>

                                        <p className="mb-2 small text-muted">Total Return</p>
                                        <h5 className="fw-bold text-primary">
                                            ${calculateReturn(investment).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </h5>
                                        <small className="text-muted">in {investment.duration_days} days</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card border-0 shadow-sm rounded-3 mb-4 overflow-hidden">
                    <div className="card-body p-5 text-center">
                        <div className="mb-3">
                            <AlertCircle size={48} className="text-muted mx-auto" style={{ opacity: 0.5 }} />
                        </div>
                        <h5 className="fw-bold text-muted mb-2">No Active Investments</h5>
                        <p className="text-muted mb-0">
                            You don't have any active investments yet. Explore the available plans below to start investing and earning daily interest.
                        </p>
                    </div>
                </div>
            )}

            {/* Available Plans */}
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                <div className="card-body p-4 p-md-5">
                    <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                        <Percent size={20} className="text-primary" />
                        Available Investment Plans
                    </h5>

                    <div className="row g-4">
                        {plans.map((plan) => (
                            <div key={plan.id} className="col-md-6 col-lg-4">
                                <div
                                    className="h-100 rounded-4 overflow-hidden position-relative"
                                    style={{
                                        boxShadow: plan.featured ? '0 20px 50px rgba(13,110,253,0.22)' : '0 4px 20px rgba(0,0,0,0.08)',
                                        border: plan.featured ? '2px solid #667eea' : '2px solid #dee2e6',
                                        background: '#fff',
                                    }}
                                >
                                    {plan.featured && (
                                        <div className="text-center py-1 text-white fw-semibold bg-primary" style={{ fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                                            Most Popular
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="text-center p-4 pb-3" style={{ background: plan.featured ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
                                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)' }}>
                                            <Percent size={28} className="text-white" />
                                        </div>
                                        <h4 className="text-white mb-1 fw-bold">{plan.type}</h4>
                                        <p className="text-white-50 mb-3" style={{ fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Account</p>

                                        <div className="d-inline-flex align-items-baseline justify-content-center px-4 py-2 rounded-pill" style={{ background: 'rgba(255,255,255,0.15)' }}>
                                            <span className="text-white fw-bold" style={{ fontSize: '3rem', lineHeight: 1 }}>
                                                {plan.rate}%
                                            </span>
                                        </div>
                                        <p className="text-white-50 mt-2 mb-0 fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '2px' }}>
                                            DAILY INTEREST
                                        </p>
                                    </div>

                                    {/* Details */}
                                    <div className="p-4">
                                        <div className="mb-3 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <small className="text-muted d-block mb-1">Minimum Investment</small>
                                            <h6 className="fw-bold text-dark">${plan.minimum_amount.toLocaleString()}</h6>
                                        </div>

                                        <div className="mb-3 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <small className="text-muted d-block mb-1">Duration</small>
                                            <h6 className="fw-bold text-dark">{plan.duration_days} Days</h6>
                                        </div>

                                        <div className="mb-4">
                                            <small className="text-muted d-block mb-1">Interest Type</small>
                                            <h6 className="fw-bold text-dark">{plan.interval_type}</h6>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handlePurchaseClick(plan)}
                                            className={`btn w-100 rounded-pill py-2 fw-semibold ${plan.featured ? 'btn-primary text-white' : 'btn-outline-primary'}`}
                                            disabled={userBalance < plan.minimum_amount}
                                        >
                                            {userBalance < plan.minimum_amount ? 'Insufficient Balance' : 'Invest Now'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Purchase Modal */}
            {selectedPlan && (
                <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0">
                            <div className="modal-header border-0 pb-0 pt-4 px-4">
                                <h5 className="modal-title fw-bold">Invest in {selectedPlan.type} Plan</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedPlan(null)}></button>
                            </div>
                            <div className="modal-body px-4">
                                {message && (
                                    <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mb-3`} role="alert">
                                        {message}
                                    </div>
                                )}

                                <form onSubmit={handlePurchase}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-dark mb-2">Investment Amount (USD)</label>
                                        <input
                                            type="number"
                                            className="form-control rounded-3 p-3"
                                            placeholder={`Minimum: $${selectedPlan.minimum_amount.toLocaleString()}`}
                                            value={purchaseAmount}
                                            onChange={(e) => setPurchaseAmount(e.target.value)}
                                            min={selectedPlan.minimum_amount}
                                            max={userBalance}
                                            step="100"
                                            required
                                        />
                                        <small className="text-muted d-block mt-2">
                                            Available Balance: ${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </small>
                                    </div>

                                    <div className="card bg-light border-0 mb-4 p-3">
                                        <small className="text-muted">Expected Return in {selectedPlan.duration_days} days:</small>
                                        <h5 className="fw-bold text-success mb-0">
                                            ${(parseFloat(purchaseAmount || 0) * (1 + (selectedPlan.rate / 100) * selectedPlan.duration_days)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </h5>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button type="submit" disabled={purchasing} className="btn btn-primary py-3 fw-bold rounded-3">
                                            {purchasing ? 'Processing...' : 'Confirm Investment'}
                                        </button>
                                        <button type="button" onClick={() => setSelectedPlan(null)} className="btn btn-light py-3 fw-bold rounded-3 border">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestmentsPage;
