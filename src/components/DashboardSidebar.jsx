import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Info, User, LogOut, Home, TrendingUp, CreditCard, Send, Globe, Download, FileText, DollarSign, Clock, Settings, HelpCircle, ShieldCheck, X, PieChart } from 'lucide-react';
import { apiRequest, clearAuth, getAuthToken, getCurrentUser, setCurrentUser, getImageUrl } from '../lib/api';

const DashboardSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getCurrentUser());

    useEffect(() => {
        const loadUser = async () => {
            try {
                const result = await apiRequest('me');
                setCurrentUser(result.user);
                setUser(result.user);
            } catch (error) {
                clearAuth();
                navigate('/sign-in');
            }
        };

        const storedUser = getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }

        if (getAuthToken()) {
            loadUser();
        }
    }, [navigate]);

    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'User';
    const isAdmin = Boolean(user?.is_admin);
    const initials = fullName
        .split(' ')
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'U';

    const handleProfileClick = () => {
        onClose?.();
        navigate('/dashboard/settings');
    };

    const handleLogout = () => {
        clearAuth();
        onClose?.();
        navigate('/sign-in');
    };

    return (
        <div className={`dashboard-sidebar d-flex flex-column ${isOpen ? 'sidebar-mobile-open' : ''}`}>
            <div className="dashboard-sidebar-header d-flex justify-content-between align-items-center mb-4 px-2 pt-1">

                <button className="btn btn-light border-0 d-lg-none p-1" onClick={onClose} aria-label="Close sidebar">
                    <X size={20} />
                </button>
            </div>

            <div className="profile-card">
                <div className="d-flex align-items-center mb-3">
                    <div className="avatar me-3" style={{ overflow: 'hidden' }}>
                        {user?.profile_image_path ? (
                            <img
                                src={getImageUrl(user.profile_image_path)}
                                alt={fullName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            initials
                        )}
                    </div>
                    <div>
                        <h6 className="mb-0 text-dark fw-bold">{fullName}</h6>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>ID: {user?.account_number || 'N/A'}</small>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        onClose?.();
                        navigate('/dashboard/kyc');
                    }}
                    className="btn btn-outline-danger btn-sm w-100 mb-2 rounded-pill d-flex align-items-center justify-content-center text-danger"
                    style={{ backgroundColor: 'rgba(220,53,69,0.1)', border: 'none' }}
                >
                    <Info className="me-2" /> Verify KYC
                </button>
                <div className="d-flex gap-2">
                    <button type="button" onClick={handleProfileClick} className="btn btn-outline-secondary btn-sm flex-grow-1 bg-white border-1 text-dark d-flex align-items-center justify-content-center">
                        <User className="me-1" /> Profile
                    </button>
                    <button type="button" onClick={handleLogout} className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center">
                        <LogOut className="me-1" /> Logout
                    </button>
                </div>
            </div>

            <div className="flex-grow-1 overflow-auto">
                <div className="sidebar-category">MAIN MENU</div>
                <NavLink to="/dashboard" end className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : ''}`} onClick={onClose}>
                    <Home className="me-2 fs-5" /> Dashboard
                </NavLink>

                <NavLink to="/dashboard/transactions" className="nav-link" onClick={onClose}>
                    <TrendingUp className="me-2 fs-5" /> Transactions
                </NavLink>

                <NavLink to="/dashboard/cards" className="nav-link" onClick={onClose}>
                    <CreditCard className="me-2 fs-5" /> Cards
                </NavLink>

                <div className="sidebar-category mt-3">TRANSFERS</div>
                <NavLink to="/dashboard/localtransfer" className="nav-link" onClick={onClose}>
                    <Send className="me-2 fs-5" /> Local Transfer
                </NavLink>

                <NavLink to="/dashboard/internationaltransfer" className="nav-link" onClick={onClose}>
                    <Globe className="me-2 fs-5" /> International Wire
                </NavLink>

                <NavLink to="/dashboard/deposits" className="nav-link" onClick={onClose}>
                    <Download className="me-2 fs-5" /> Deposit
                </NavLink>

                <div className="sidebar-category mt-3">SERVICES</div>
                <NavLink to="/dashboard/loan" className="nav-link" onClick={onClose}>
                    <FileText className="me-2 fs-5" /> Loan Request
                </NavLink>

                <NavLink to="/dashboard/investments" className="nav-link" onClick={onClose}>
                    <PieChart className="me-2 fs-5" /> Investments
                </NavLink>

                <NavLink to="/dashboard/irs-refund" className="nav-link" onClick={onClose}>
                    <DollarSign className="me-2 fs-5" /> IRS Tax Refund
                </NavLink>

                <NavLink to="/dashboard/viewloan" className="nav-link" onClick={onClose}>
                    <Clock className="me-2 fs-5" /> Loan History
                </NavLink>

                <div className="sidebar-category mt-3">ACCOUNT</div>
                <NavLink to="/dashboard/settings" className="nav-link" onClick={onClose}>
                    <Settings className="me-2 fs-5" /> Settings
                </NavLink>

                <NavLink to="/dashboard/support" className="nav-link" onClick={onClose}>
                    <HelpCircle className="me-2 fs-5" /> Support Ticket
                </NavLink>

            </div>

            <div className="p-3 border-top d-flex justify-content-between align-items-center text-muted" style={{ fontSize: '0.8rem' }}>
                <span className="d-flex align-items-center"><ShieldCheck className="text-success me-1 fs-6" /> Secure Banking</span>
                <span>v1.2.0</span>
            </div>
        </div>
    );
};

export default DashboardSidebar;
