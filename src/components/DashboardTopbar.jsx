import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Wallet, Bell, Menu, User, Settings, LifeBuoy, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, clearAuth, getAuthToken, getCurrentUser, getImageUrl } from '../lib/api';

const DashboardTopbar = ({ onMenuToggle }) => {
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const notificationRef = useRef(null);
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const [dashboard, setDashboard] = useState({ balance: 0 });
    const [user, setUser] = useState(getCurrentUser());
    const [menuOpen, setMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const result = await apiRequest('dashboard');
                setDashboard(result.dashboard || { balance: 0 });
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

    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'User';
    const initials = fullName
        .split(' ')
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'U';

    const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    }).format(Number(value || 0));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOpenSettings = () => {
        setMenuOpen(false);
        navigate('/dashboard/settings');
    };

    const handleOpenSupport = () => {
        setMenuOpen(false);
        navigate('/dashboard/support');
    };

    const handleSignOut = () => {
        clearAuth();
        setMenuOpen(false);
        navigate('/sign-in');
    };

    const markNotificationAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        setNotificationOpen(false);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const seconds = Math.floor((now - timestamp) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return '✓';
            case 'warning':
                return '!';
            case 'error':
                return '✕';
            default:
                return 'ℹ';
        }
    };

    return (
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <div className="d-flex align-items-center gap-3">
                {/* Hamburger – visible only on mobile */}
                <button
                    className="btn btn-light d-lg-none border-0 p-2"
                    onClick={onMenuToggle}
                    aria-label="Toggle sidebar"
                >
                    <Menu size={22} />
                </button>
                <div className="text-muted d-flex align-items-center d-none d-sm-flex">
                    <Calendar className="me-2" size={18} />
                    {formattedDate}
                </div>
            </div>
            <div className="d-flex align-items-center gap-3">
                <button className="btn btn-primary rounded-pill d-flex align-items-center px-3 py-1" style={{ border: 'none', backgroundColor: '#4a6cf7' }}>
                    <Wallet className="me-2" size={16} /> {formatCurrency(dashboard.balance)}
                </button>

                {/* Notification Dropdown */}
                <div ref={notificationRef} className="position-relative">
                    <button
                        type="button"
                        onClick={() => setNotificationOpen(!notificationOpen)}
                        className="btn btn-light border-0 position-relative p-2"
                        aria-label="Open notifications"
                        style={{ cursor: 'pointer' }}
                    >
                        <Bell size={20} className="text-muted" />
                        {unreadCount > 0 && (
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                style={{ fontSize: '10px', padding: '3px 6px' }}
                            >
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {notificationOpen && (
                        <div
                            className="position-absolute end-0 mt-2 bg-white border rounded-3 shadow-lg py-0 overflow-hidden"
                            style={{ minWidth: '380px', maxHeight: '500px', zIndex: 1000 }}
                        >
                            {/* Header */}
                            <div className="px-3 py-3 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
                                <h6 className="mb-0 fw-semibold text-dark">Notifications</h6>
                                {notifications.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearAllNotifications}
                                        className="btn btn-link text-danger text-decoration-none p-0 small"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {notifications.length === 0 ? (
                                    <div className="px-3 py-5 text-center text-muted">
                                        <Bell size={40} className="mb-2 opacity-50" />
                                        <p className="small mb-0">No notifications yet</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className="px-3 py-3 border-bottom d-flex gap-3"
                                            style={{
                                                backgroundColor: notif.read ? '#fff' : '#f0f7ff',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s',
                                            }}
                                            onMouseEnter={(e) => !notif.read && (e.currentTarget.style.backgroundColor = '#e8f1ff')}
                                            onMouseLeave={(e) => !notif.read && (e.currentTarget.style.backgroundColor = '#f0f7ff')}
                                            onClick={() => !notif.read && markNotificationAsRead(notif.id)}
                                        >
                                            {/* Icon */}
                                            <div
                                                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    backgroundColor:
                                                        notif.type === 'success'
                                                            ? '#d4edda'
                                                            : notif.type === 'warning'
                                                            ? '#fff3cd'
                                                            : notif.type === 'error'
                                                            ? '#f8d7da'
                                                            : '#cfe2ff',
                                                    color:
                                                        notif.type === 'success'
                                                            ? '#155724'
                                                            : notif.type === 'warning'
                                                            ? '#856404'
                                                            : notif.type === 'error'
                                                            ? '#721c24'
                                                            : '#0c5de4',
                                                }}
                                            >
                                                {getNotificationIcon(notif.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                <div className="d-flex justify-content-between align-items-start mb-1">
                                                    <h6 className="mb-0 fw-semibold text-dark small">
                                                        {notif.title}
                                                        {!notif.read && (
                                                            <span
                                                                className="ms-2 rounded-circle"
                                                                style={{
                                                                    display: 'inline-block',
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    backgroundColor: '#0c5de4',
                                                                }}
                                                            />
                                                        )}
                                                    </h6>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification(notif.id);
                                                        }}
                                                        className="btn btn-link text-muted text-decoration-none p-0 small"
                                                        style={{ fontSize: '16px' }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                <p className="mb-2 text-muted small" style={{ lineHeight: '1.4' }}>
                                                    {notif.message}
                                                </p>
                                                <span className="text-muted" style={{ fontSize: '11px' }}>
                                                    {formatTimeAgo(notif.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="px-3 py-2 text-center border-top">
                                    <button
                                        type="button"
                                        className="btn btn-link text-primary text-decoration-none p-0 small fw-semibold"
                                    >
                                        View All Notifications
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Profile Menu */}
                <div ref={menuRef} className="position-relative">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        className="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold border-0"
                        style={{ width: '35px', height: '35px', cursor: 'pointer', overflow: 'hidden' }}
                        aria-label="Open profile menu"
                    >
                        {user?.profile_image_path ? (
                            <img
                                src={getImageUrl(user.profile_image_path)}
                                alt={fullName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            initials
                        )}
                    </button>

                    {menuOpen && (
                        <div className="position-absolute end-0 mt-2 bg-white border rounded-3 shadow-sm py-2" style={{ minWidth: '220px', zIndex: 1000 }}>
                            <div className="px-3 py-2 border-bottom">
                                <div className="fw-semibold text-dark">{fullName}</div>
                                <div className="small text-muted">ID: {user?.account_number || 'N/A'}</div>
                            </div>
                            <button type="button" onClick={handleOpenSupport} className="btn btn-link text-dark text-decoration-none w-100 text-start px-3 py-2 d-flex align-items-center gap-2">
                                <LifeBuoy size={16} /> Support Ticket
                            </button>
                            <button type="button" onClick={handleOpenSettings} className="btn btn-link text-dark text-decoration-none w-100 text-start px-3 py-2 d-flex align-items-center gap-2">
                                <Settings size={16} /> Account Settings
                            </button>
                            <button type="button" onClick={handleSignOut} className="btn btn-link text-danger text-decoration-none w-100 text-start px-3 py-2 d-flex align-items-center gap-2 border-top mt-1">
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardTopbar;
