import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, Key, Camera, Copy, Info, HelpCircle, ArrowRight, Mail, Phone, MapPin, Calendar, Lock, CreditCard, Eye, EyeOff } from 'lucide-react';
import { apiRequest, getAuthToken, getCurrentUser, setCurrentUser, getImageUrl } from '../../lib/api';

const SettingsPage = () => {
    const [user, setUser] = useState(getCurrentUser());
    const [activeTab, setActiveTab] = useState('profile');
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [pinForm, setPinForm] = useState({
        currentPin: '',
        newPin: '',
        confirmPin: '',
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [showPin, setShowPin] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [pinMessage, setPinMessage] = useState({ type: '', text: '' });
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [loadingPin, setLoadingPin] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageMessage, setImageMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const result = await apiRequest('profile');
                setCurrentUser(result.user);
                setUser(result.user);
            } catch (error) {
                console.error('Profile load failed', error);
            }
        };

        const storedUser = getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }

        if (getAuthToken()) {
            loadProfile();
        }
    }, []);

    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'User';
    const initials = fullName
        .split(' ')
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'U';

    const handleProfileImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleProfileImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setImageMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            formData.append('profile_image', file);

            const result = await apiRequest('upload-profile-image', {
                method: 'POST',
                body: formData,
            });

            setCurrentUser(result.user);
            setUser(result.user);
            setImageMessage({ type: 'success', text: 'Profile image updated successfully.' });
        } catch (error) {
            setImageMessage({ type: 'error', text: error.message || 'Failed to upload profile image.' });
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (passwordForm.newPassword.length < 8) {
            setPasswordMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New password and confirm password do not match.' });
            return;
        }

        setLoadingPassword(true);

        try {
            const result = await apiRequest('change-password', {
                method: 'POST',
                body: {
                    current_password: passwordForm.currentPassword,
                    new_password: passwordForm.newPassword,
                    confirm_new_password: passwordForm.confirmPassword,
                },
            });

            setPasswordMessage({ type: 'success', text: result.message || 'Password updated successfully.' });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setPasswordMessage({ type: 'error', text: error.message || 'Password update failed.' });
        } finally {
            setLoadingPassword(false);
        }
    };

    const handlePinChange = async (e) => {
        e.preventDefault();
        setPinMessage({ type: '', text: '' });

        if (!/^\d{4}$/.test(pinForm.newPin)) {
            setPinMessage({ type: 'error', text: 'New PIN must be exactly 4 numeric digits.' });
            return;
        }

        if (pinForm.newPin !== pinForm.confirmPin) {
            setPinMessage({ type: 'error', text: 'New PIN and confirm PIN do not match.' });
            return;
        }

        setLoadingPin(true);

        try {
            const result = await apiRequest('change-pin', {
                method: 'POST',
                body: {
                    current_pin: pinForm.currentPin,
                    new_pin: pinForm.newPin,
                    confirm_new_pin: pinForm.confirmPin,
                },
            });

            setPinMessage({ type: 'success', text: result.message || 'PIN updated successfully.' });
            setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
        } catch (error) {
            setPinMessage({ type: 'error', text: error.message || 'PIN update failed.' });
        } finally {
            setLoadingPin(false);
        }
    };

    return (
        <div className="dashboard-content w-100 pb-5">
            {/* Title & breadcrumb */}
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Account Settings</h3>
                <div className="text-muted small">
                    <Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-dark">Settings</span>
                </div>
            </div>

            {imageMessage.text && (
                <div className={`alert alert-dismissible fade show ${imageMessage.type === 'success' ? 'alert-success' : 'alert-danger'} mb-4`} role="alert">
                    {imageMessage.text}
                    <button type="button" className="btn-close" onClick={() => setImageMessage({ type: '', text: '' })}></button>
                </div>
            )}

            <div className="row g-4">
                {/* Left Column (Navigation) */}
                <div className="col-lg-4 col-xl-3">

                    {/* Profile Card */}
                    <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                        <div
                            className="pt-4 pb-5 text-center text-white position-relative"
                            style={{ background: 'linear-gradient(135deg, #023888 0%, #1a56db 100%)' }}
                        >
                            {/* Waves Background */}
                            <div className="position-absolute w-100" style={{ bottom: '-5px', left: 0, right: 0 }}>
                                <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '40px' }}>
                                    <path d="M0,0 C320,80 420,120 720,60 C1020,0 1120,40 1440,80 L1440,120 L0,120 Z" fill="white" />
                                </svg>
                            </div>

                            <div className="position-relative d-inline-block mb-3" style={{ zIndex: 1 }}>
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-circle border border-3 border-white"
                                    style={{
                                        width: '90px',
                                        height: '90px',
                                        backgroundColor: '#7bba71',
                                        fontSize: '32px',
                                        fontWeight: 'bold',
                                        overflow: 'hidden',
                                    }}
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
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-light rounded-circle position-absolute d-flex align-items-center justify-content-center p-1 shadow"
                                    style={{ bottom: '0', right: '-5px', width: '30px', height: '30px', cursor: uploadingImage ? 'not-allowed' : 'pointer' }}
                                    onClick={handleProfileImageClick}
                                    disabled={uploadingImage}
                                >
                                    <Camera size={14} className="text-primary" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleProfileImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <div className="position-relative" style={{ zIndex: 1 }}>
                                <h5 className="fw-bold mb-2 text-white-50">{fullName}</h5>
                                <p className="mb-0 small text-white-50">Account #{user?.account_number || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="p-3">
                            <div className="d-flex flex-column gap-2">
                                <button type="button" onClick={() => setActiveTab('profile')} className="btn text-decoration-none px-3 py-2 rounded-3 d-flex align-items-center gap-3 fw-semibold border-0 text-start" style={{ backgroundColor: activeTab === 'profile' ? '#6c8cf8' : 'transparent', color: activeTab === 'profile' ? '#fff' : '#222' }}>
                                    <User size={18} /> Profile Information
                                </button>
                                <button type="button" onClick={() => setActiveTab('security')} className="btn text-decoration-none px-3 py-2 rounded-3 d-flex align-items-center gap-3 fw-semibold border-0 text-start" style={{ backgroundColor: activeTab === 'security' ? '#6c8cf8' : 'transparent', color: activeTab === 'security' ? '#fff' : '#222' }}>
                                    <Shield size={18} /> Security Settings
                                </button>
                                <button type="button" onClick={() => setActiveTab('pin')} className="btn text-decoration-none px-3 py-2 rounded-3 d-flex align-items-center gap-3 fw-semibold border-0 text-start" style={{ backgroundColor: activeTab === 'pin' ? '#6c8cf8' : 'transparent', color: activeTab === 'pin' ? '#fff' : '#222' }}>
                                    <Key size={18} /> Transaction PIN
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Need Help Card */}
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '40px', height: '40px', backgroundColor: '#e6f0ff' }}>
                                <HelpCircle size={20} className="text-primary" />
                            </div>
                            <h6 className="fw-bold mb-2">Need Help?</h6>
                            <p className="text-muted small mb-3">Contact our support team if you need assistance with your account settings or have any questions.</p>
                            <Link to="/dashboard/support" className="text-primary text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1">
                                Contact Support <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Right Column (Form) */}
                <div className="col-lg-8 col-xl-9">
                    <div className="card border-0 shadow-sm rounded-4 h-100" style={{ backgroundColor: '#fdfcfe' }}>
                        {activeTab === 'profile' && (
                            <>
                                <div className="p-4 p-md-5 border-bottom">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <User className="text-primary" size={20} />
                                        <h5 className="fw-bold mb-0 text-dark">Profile Information</h5>
                                    </div>
                                    <p className="text-muted small mb-0 ms-4 ps-1">Your personal information and account details</p>
                                </div>

                                <div className="p-4 p-md-5">
                                    <form>
                                        <div className="row g-4 mb-4">
                                            <div className="col-md-6">
                                                <label className="form-label text-dark small fw-semibold mb-1">First Name</label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0 text-muted">
                                                        <User size={16} />
                                                    </span>
                                                    <input type="text" className="form-control border-start-0 ps-0 bg-light" value={user?.first_name || ''} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-dark small fw-semibold mb-1">Last Name</label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0 text-muted">
                                                        <User size={16} />
                                                    </span>
                                                    <input type="text" className="form-control border-start-0 ps-0 bg-light" value={user?.last_name || ''} readOnly />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label text-dark small fw-semibold mb-1">Account Number</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0 text-muted fw-bold">#</span>
                                                <input type="text" className="form-control border-start-0 border-end-0 ps-0 bg-light fw-semibold" value={user?.account_number || 'N/A'} readOnly />
                                                <span className="input-group-text bg-light border-start-0 text-muted" style={{ cursor: 'pointer' }}>
                                                    <Copy size={16} />
                                                </span>
                                            </div>
                                            <div className="form-text text-muted small mt-1">This is your unique account identifier</div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label text-dark small fw-semibold mb-1">Email Address</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0 text-muted">
                                                    <Mail size={16} />
                                                </span>
                                                <input type="email" className="form-control border-start-0 ps-0 bg-light" value={user?.email || ''} readOnly />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label text-dark small fw-semibold mb-1">Date of Birth</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white border-end-0 text-muted">
                                                    <Calendar size={16} />
                                                </span>
                                                <input type="text" className="form-control border-start-0 ps-0" placeholder="mm/dd/yyyy" />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label text-dark small fw-semibold mb-1">Phone Number</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white border-end-0 text-muted">
                                                    <Phone size={16} />
                                                </span>
                                                <input type="text" className="form-control border-start-0 ps-0" defaultValue={user?.phone || ''} />
                                            </div>
                                        </div>

                                        <div className="mb-5">
                                            <label className="form-label text-dark small fw-semibold mb-1">Address</label>
                                            <div className="d-flex">
                                                <div className="p-2 border border-end-0 text-muted bg-white" style={{ borderTopLeftRadius: '0.375rem', borderBottomLeftRadius: '0.375rem' }}>
                                                    <MapPin size={16} className="mt-1" />
                                                </div>
                                                <textarea className="form-control border-start-0 ps-0" rows="3" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} value={user?.address || ''} readOnly></textarea>
                                            </div>
                                        </div>

                                        <div className="alert d-flex gap-3 align-items-start mb-0" style={{ backgroundColor: '#eef3ff', border: '1px solid #dce6ff', borderRadius: '8px' }}>
                                            <Info size={20} className="text-primary flex-shrink-0 mt-1" />
                                            <div>
                                                <h6 className="fw-bold mb-1 text-primary">Account Information</h6>
                                                <p className="mb-0 small text-primary" style={{ opacity: 0.9 }}>
                                                    To update your personal information, please contact our customer support team with your request.
                                                </p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </>
                        )}

                        {activeTab === 'security' && (
                            <>
                                <div className="p-4 p-md-5 border-bottom">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <Shield className="text-primary" size={20} />
                                        <h5 className="fw-bold mb-0 text-dark">Security Settings</h5>
                                    </div>
                                    <p className="text-muted small mb-0 ms-4 ps-1">Update your login password and secure your account</p>
                                </div>

                                <div className="p-4 p-md-5">
                                    <form onSubmit={handlePasswordChange}>
                                        <div className="mb-4">
                                            <label className="form-label text-dark small fw-semibold mb-1">Current Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0 text-muted">
                                                    <Lock size={16} />
                                                </span>
                                                <input type={showPassword.current ? 'text' : 'password'} className="form-control border-start-0 ps-0" placeholder="Enter current password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
                                                <button type="button" className="btn btn-outline-secondary border-start-0" onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}>
                                                    {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label text-dark small fw-semibold mb-1">New Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0 text-muted">
                                                    <Lock size={16} />
                                                </span>
                                                <input type={showPassword.new ? 'text' : 'password'} className="form-control border-start-0 ps-0" placeholder="Enter new password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                                                <button type="button" className="btn btn-outline-secondary border-start-0" onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}>
                                                    {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label text-dark small fw-semibold mb-1">Confirm New Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0 text-muted">
                                                    <Lock size={16} />
                                                </span>
                                                <input type={showPassword.confirm ? 'text' : 'password'} className="form-control border-start-0 ps-0" placeholder="Confirm new password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
                                                <button type="button" className="btn btn-outline-secondary border-start-0" onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}>
                                                    {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        {passwordMessage.text && (
                                            <div className={`alert mt-3 mb-3 ${passwordMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                                                {passwordMessage.text}
                                            </div>
                                        )}

                                        <button type="submit" className="btn btn-primary px-4 fw-semibold" style={{ backgroundColor: '#023888', border: 'none' }} disabled={loadingPassword}>
                                            {loadingPassword ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}

                        {activeTab === 'pin' && (
                            <>
                                <div className="p-4 p-md-5 border-bottom">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <CreditCard className="text-primary" size={20} />
                                        <h5 className="fw-bold mb-0 text-dark">Transaction PIN</h5>
                                    </div>
                                    <p className="text-muted small mb-0 ms-4 ps-1">Change your secure transaction PIN</p>
                                </div>

                                <div className="p-4 p-md-5">
                                    <form onSubmit={handlePinChange}>
                                        <div className="mb-4">
                                            <label className="form-label text-dark small fw-semibold mb-1">Current PIN</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0 text-muted">
                                                    <Key size={16} />
                                                </span>
                                                <input type={showPin.current ? 'text' : 'password'} inputMode="numeric" maxLength="4" className="form-control border-start-0 ps-0" placeholder="••••" value={pinForm.currentPin} onChange={(e) => setPinForm({ ...pinForm, currentPin: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
                                                <button type="button" className="btn btn-outline-secondary border-start-0" onClick={() => setShowPin({ ...showPin, current: !showPin.current })}>
                                                    {showPin.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label text-dark small fw-semibold mb-1">New PIN</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0 text-muted">
                                                    <Key size={16} />
                                                </span>
                                                <input type={showPin.new ? 'text' : 'password'} inputMode="numeric" maxLength="4" className="form-control border-start-0 ps-0" placeholder="••••" value={pinForm.newPin} onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
                                                <button type="button" className="btn btn-outline-secondary border-start-0" onClick={() => setShowPin({ ...showPin, new: !showPin.new })}>
                                                    {showPin.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label text-dark small fw-semibold mb-1">Confirm New PIN</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0 text-muted">
                                                    <Key size={16} />
                                                </span>
                                                <input type={showPin.confirm ? 'text' : 'password'} inputMode="numeric" maxLength="4" className="form-control border-start-0 ps-0" placeholder="••••" value={pinForm.confirmPin} onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
                                                <button type="button" className="btn btn-outline-secondary border-start-0" onClick={() => setShowPin({ ...showPin, confirm: !showPin.confirm })}>
                                                    {showPin.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        {pinMessage.text && (
                                            <div className={`alert mt-3 mb-3 ${pinMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                                                {pinMessage.text}
                                            </div>
                                        )}

                                        <button type="submit" className="btn btn-primary px-4 fw-semibold" style={{ backgroundColor: '#023888', border: 'none' }} disabled={loadingPin}>
                                            {loadingPin ? 'Updating...' : 'Update PIN'}
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
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

            <style>{`
                .hover-bg-light:hover {
                    background-color: #f8f9fa;
                }
            `}</style>
        </div>
    );
};

export default SettingsPage;



