import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Wallet, Bell, Building, Send, Plus, Clock, TrendingUp, TrendingDown, Gauge, EyeOff, ShieldCheck, CreditCard, ChevronRight, User, Globe, BarChart, HelpCircle, MessageCircle } from 'lucide-react';
import { apiRequest, getAuthToken, getCurrentUser, setCurrentUser } from '../../lib/api';

const DashboardPage = () => {
    const [dashboard, setDashboard] = useState({
        balance: 0,
        monthly_income: 0,
        monthly_outgoing: 0,
        transaction_limit: 500000,
        account_number: '',
        account_status: 'inactive',
        account_type: 'Checking',
        full_name: '',
    });
    const [cards, setCards] = useState([]);
    const [user, setUser] = useState(getCurrentUser());

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const profileResult = await apiRequest('me');
                const nextUser = profileResult.user || getCurrentUser();
                setCurrentUser(nextUser);
                setUser(nextUser);

                const dashboardResult = await apiRequest('dashboard');
                const nextDashboard = dashboardResult.dashboard || dashboard;

                if (!nextDashboard.account_number && nextUser?.account_number) {
                    nextDashboard.account_number = nextUser.account_number;
                }

                setDashboard(nextDashboard);

                const cardsResult = await apiRequest('cards');
                setCards((cardsResult.cards || []).filter((card) => (card.status || '').toLowerCase() === 'active'));
            } catch (error) {
                console.error('Dashboard load failed', error);
            }
        };

        const storedUser = getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }

        if (getAuthToken()) {
            loadDashboard();
        }
    }, []);

    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

    const formatAccountAge = (createdAt) => {
        if (!createdAt) {
            return 'N/A';
        }

        const parsedDate = new Date(String(createdAt).replace(' ', 'T'));
        if (Number.isNaN(parsedDate.getTime())) {
            return 'N/A';
        }

        const diffMs = Date.now() - parsedDate.getTime();
        if (diffMs <= 0) {
            return 'Just now';
        }

        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const years = Math.floor(totalDays / 365);
        const remainingAfterYears = totalDays % 365;
        const months = Math.floor(remainingAfterYears / 30);
        const days = remainingAfterYears % 30;

        if (years > 0) {
            return `${years} year${years > 1 ? 's' : ''}${months > 0 ? ` ${months} month${months > 1 ? 's' : ''}` : ''}`;
        }

        if (months > 0) {
            return `${months} month${months > 1 ? 's' : ''}${days > 0 ? ` ${days} day${days > 1 ? 's' : ''}` : ''}`;
        }

        return `${totalDays} day${totalDays === 1 ? '' : 's'}`;
    };

    const fullName = dashboard.full_name || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'User';
    const initials = fullName
        .split(' ')
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'U';

    return (
        <div className="dashboard-content w-100">


            <div className="row g-4">
                {/* Left Column (Main) */}
                <div className="col-lg-8">
                    {/* Main Account Card */}
                    <div className="card border-0 shadow-sm text-white mb-4" style={{ borderRadius: '16px', backgroundColor: '#023888', background: 'linear-gradient(135deg, #023888 0%, #0352c7 100%)' }}>
                        <div className="card-body p-4 p-md-5 position-relative overflow-hidden">
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div className="d-flex align-items-center">
                                    <div className="avatar rounded-circle bg-light text-primary d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '48px', height: '48px' }}>
                                        {initials}
                                    </div>
                                    <div>
                                        <p className="mb-0 text-white-50">Good Evening</p>
                                        <h5 className="mb-0 text-white fw-bold">{fullName.split(' ')[0] || 'User'}</h5>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <h5 className="mb-0 text-white fw-bold">{formattedTime}</h5>
                                    <p className="mb-0 text-white-50 small">{formattedDate}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="mb-1 text-white-50 d-flex justify-content-between align-items-center w-50">
                                    Available Balance <EyeOff className="cursor-pointer" />
                                </p>
                                <h1 className="display-3- text-white fw-bold mb-0">{formatCurrency(dashboard.balance)}</h1>
                            </div>

                            <div className="d-flex flex-wrap justify-content-between align-items-end mt-5 pt-3 border-top border-light border-opacity-25">
                                <div>
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="bg-white bg-opacity-25 rounded-circle d-flex justify-content-center align-items-center me-2" style={{ width: '28px', height: '28px' }}>
                                            <ShieldCheck />
                                        </div>
                                        <span className="text-white-50 me-2">Your Account Number</span>
                                        <span className="badge bg-danger rounded-pill">{dashboard.account_status}</span>
                                    </div>
                                    <h4 className="text-white mb-0 fw-bold letter-spacing-2">{dashboard.account_number || 'N/A'}</h4>
                                </div>
                                <div className="d-flex gap-2 mt-3 mt-md-0">
                                    <Link to="/dashboard/transactions" className="btn btn-light bg-white text-primary px-4 fw-bold">
                                        <TrendingUp className="me-2" /> Transactions
                                    </Link>
                                    <Link to="/dashboard/deposits" className="btn btn-outline-light px-4 fw-bold text-white">
                                        <Wallet className="me-2" /> Top up
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Welcome Actions */}
                    <div className="mb-4">
                        <h4 className="fw-bold mb-1">What would you like to do today?</h4>
                        <p className="text-muted mb-3">Choose from our popular actions below</p>

                        <div className="row g-3">

                            <div className="col-6 col-md-4">
                                <Link to="/dashboard/localtransfer" className="card h-100 border-0 shadow-sm text-center py-4 text-white text-decoration-none d-block" style={{ borderRadius: '12px', backgroundColor: '#6c8cf8', cursor: 'pointer' }}>
                                    <div className="mb-2">
                                        <Send className="fs-3" />
                                    </div>
                                    <h6 className="mb-0">Send Money</h6>
                                </Link>
                            </div>
                            <div className="col-6 col-md-4">
                                <Link to="/dashboard/deposits" className="card h-100 border-0 shadow-sm text-center py-4 text-decoration-none d-block" style={{ borderRadius: '12px', backgroundColor: '#e8fdf0', cursor: 'pointer' }}>
                                    <div className="mb-2 text-success">
                                        <Plus className="fs-3" />
                                    </div>
                                    <h6 className="mb-0 text-dark">Deposit</h6>
                                </Link>
                            </div>
                            <div className="col-6 col-md-4">
                                <Link to="/dashboard/transactions" className="card h-100 border-0 shadow-sm text-center py-4 text-decoration-none d-block" style={{ borderRadius: '12px', backgroundColor: '#f6efff', cursor: 'pointer' }}>
                                    <div className="mb-2" style={{ color: '#9d61e4' }}>
                                        <Clock className="fs-3" />
                                    </div>
                                    <h6 className="mb-0 text-dark">History</h6>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Summary Balances Row */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-6 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-3 p-3 h-100" style={{ backgroundColor: '#e2ebfa' }}>
                                <small className="text-muted d-block mb-1">Current Balance</small>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="mb-0 fw-bold">{formatCurrency(dashboard.balance)}</h4>
                                    <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }}>
                                        <Wallet />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-3 p-3 h-100" style={{ backgroundColor: '#e8fdf0' }}>
                                <small className="text-muted d-block mb-1">Monthly Income</small>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="mb-0 fw-bold text-success">{formatCurrency(dashboard.monthly_income)}</h4>
                                    <div className="bg-white text-success rounded-circle d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }}>
                                        <TrendingUp />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-3 p-3 h-100" style={{ backgroundColor: '#ffecec' }}>
                                <small className="text-muted d-block mb-1">Monthly Outgoing</small>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="mb-0 fw-bold text-danger">{formatCurrency(dashboard.monthly_outgoing)}</h4>
                                    <div className="bg-white text-danger rounded-circle d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }}>
                                        <TrendingDown />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xl-3">
                            <div className="card border-0 shadow-sm rounded-3 p-3 h-100" style={{ backgroundColor: '#f6efff' }}>
                                <small className="text-muted d-block mb-1">Transaction Limit</small>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 fw-bold" style={{ color: '#9d61e4' }}>{formatCurrency(dashboard.transaction_limit)}</h5>
                                    <div className="bg-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px', color: '#9d61e4' }}>
                                        <Gauge />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Cards / Recent Transactions Tabs */}
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold"><CreditCard className="me-2 text-muted" /> Your Cards</h5>
                            <a href="/dashboard/cards" className="text-decoration-none fw-bold">View all <ChevronRight /></a>
                        </div>
                        {cards.length === 0 ? (
                            <div className="card-body text-center py-5">
                                <div className="mb-3">
                                    <div className="d-inline-flex justify-content-center align-items-center bg-light rounded-circle" style={{ width: '80px', height: '80px' }}>
                                        <CreditCard className="text-muted" style={{ fontSize: '2.5rem' }} />
                                    </div>
                                </div>
                                <h5 className="fw-bold mb-2">No active cards yet</h5>
                                <p className="text-muted mx-auto mb-4" style={{ maxWidth: '400px' }}>Your approved virtual cards will appear here once the admin activates them.</p>
                                <Link to="/dashboard/cards/apply" className="btn btn-primary px-4 py-2 fw-bold" style={{ backgroundColor: '#023888', border: 'none' }}>
                                    <Plus className="me-1" /> Apply for Card
                                </Link>
                            </div>
                        ) : (
                            <div className="card-body p-4">
                                <div className="row g-3">
                                    {cards.map((card) => (
                                        <div key={card.id} className="col-md-6">
                                            <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: 'linear-gradient(135deg, #023888 0%, #0352c7 100%)' }}>
                                                <div className="card-body p-4 text-white">
                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <span className="fw-bold text-uppercase">{card.card_type}</span>
                                                        <span className="badge rounded-pill bg-light bg-opacity-10 px-3 py-2" style={{ textTransform: 'capitalize' }}>{card.status}</span>
                                                    </div>
                                                    <div className="mb-4 fw-bold" style={{ letterSpacing: '3px' }}>{card.card_number || 'CARD ACTIVE'}</div>
                                                    <div className="d-flex justify-content-between align-items-end">
                                                        <div>
                                                            <small className="text-white-50 d-block mb-1">Cardholder</small>
                                                            <span className="fw-semibold">{card.cardholder_name}</span>
                                                        </div>
                                                        <div>
                                                            <small className="text-white-50 d-block mb-1">Balance</small>
                                                            <span className="fw-semibold">${Number(card.balance || 0).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Right Column (Sidebar widgets) */}
                <div className="col-lg-4">
                    {/* Quick Transfer */}
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                            <h5 className="mb-0 fw-bold">Quick Transfer</h5>
                        </div>
                        <div className="card-body p-4">
                            <Link to="/dashboard/localtransfer" className="p-3 mb-3 border rounded-3 cursor-pointer d-flex justify-content-between align-items-center hover-bg-light transition-all text-decoration-none text-dark">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '45px', height: '45px' }}>
                                        <User className="fs-5" />
                                    </div>
                                    <div>
                                        <h6 className="mb-1 fw-bold">Local Transfer</h6>
                                        <small className="text-muted">0% Handling charges</small>
                                    </div>
                                </div>
                                <ChevronRight className="text-muted" />
                            </Link>

                            <Link to="/dashboard/internationaltransfer" className="p-3 border rounded-3 cursor-pointer d-flex justify-content-between align-items-center hover-bg-light transition-all text-decoration-none text-dark">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '45px', height: '45px', backgroundColor: '#6c8cf8' }}>
                                        <Globe className="fs-5" />
                                    </div>
                                    <div>
                                        <h6 className="mb-1 fw-bold">International Transfer</h6>
                                        <small className="text-muted">Global reach, 0% fee</small>
                                    </div>
                                </div>
                                <ChevronRight className="text-muted" />
                            </Link>
                        </div>
                    </div>

                    {/* Account Statistics */}
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                            <h5 className="mb-0 fw-bold">Account Statistics</h5>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '40px', height: '40px', backgroundColor: '#6c8cf8' }}>
                                    <CreditCard />
                                </div>
                                <div>
                                    <small className="text-muted d-block">Transaction Limit</small>
                                    <h6 className="mb-0 fw-bold">$500,000.00</h6>
                                </div>
                            </div>

                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-warning text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '40px', height: '40px', backgroundColor: '#ffd452' }}>
                                    <Clock />
                                </div>
                                <div>
                                    <small className="text-muted d-block">Pending Transactions</small>
                                    <h6 className="mb-0 fw-bold">$0.00</h6>
                                </div>
                            </div>

                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '40px', height: '40px', backgroundColor: '#57c784' }}>
                                    <BarChart />
                                </div>
                                <div>
                                    <small className="text-muted d-block">Transaction Volume</small>
                                    <h6 className="mb-0 fw-bold">$0.00</h6>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <div className="text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '40px', height: '40px', backgroundColor: '#d5b3ff' }}>
                                    <Calendar />
                                </div>
                                <div>
                                    <small className="text-muted d-block">Account Age</small>
                                    <h6 className="mb-0 fw-bold">{formatAccountAge(user?.created_at)}</h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Need Help */}
                    <div className="card border-0 shadow-sm text-center text-white" style={{ borderRadius: '12px', backgroundColor: '#6c8cf8' }}>
                        <div className="card-body p-4">
                            <div className="bg-white text-primary rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '60px', height: '60px' }}>
                                <HelpCircle className="fs-2" />
                            </div>
                            <h5 className="fw-bold mb-3">Need Help?</h5>
                            <p className="small mb-4 text-white-50">Our support team is here to assist you 24/7</p>
                            <Link to="/dashboard/support" className="btn btn-primary w-100 fw-bold rounded-pill" style={{ backgroundColor: '#023888', border: 'none' }}>
                                <MessageCircle className="me-2" /> Contact Support
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center mt-5 pt-3 border-top text-muted small">
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

export default DashboardPage;

