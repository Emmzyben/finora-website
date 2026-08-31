import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, CheckCircle2 } from 'lucide-react';

const KYC_STORAGE_KEY = 'finora_kyc_submitted';

const KYCPage = () => {
    const navigate = useNavigate();
    const [cardPhoto, setCardPhoto] = useState(null);
    const [selfiePhoto, setSelfiePhoto] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(() => {
        const saved = localStorage.getItem(KYC_STORAGE_KEY);
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem(KYC_STORAGE_KEY, String(isSubmitted));
    }, [isSubmitted]);

    const handleFileChange = (setter, event) => {
        const file = event.target.files?.[0] || null;
        setter(file);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <div className="dashboard-content w-100 pb-5">
            <div className="mb-4">
                <h3 className="fw-bold mb-1">KYC Verification</h3>
                <div className="text-muted small">
                    <Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-dark">KYC Verification</span>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                <div className="p-4 p-md-5">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                        <div>
                            <p className="text-muted small mb-1">Verification Status</p>
                            <h4 className="fw-bold mb-0 text-danger">{isSubmitted ? 'Verified' : 'Unverified'}</h4>
                        </div>
                        
                    </div>

                    {!isSubmitted ? (
                        <div className="alert alert-light border mb-4" style={{ backgroundColor: '#f5f8ff' }}>
                            <p className="mb-0 text-dark fw-semibold">
                                Kindly provide a selfie of you holding your valid ID card
                            </p>
                        </div>
                    ) : (
                        <div className="alert alert-success border mb-4" style={{ backgroundColor: '#eafaf1', borderColor: '#bbf0d3' }}>
                            <p className="mb-0 text-success fw-semibold">
                                Your KYC documents were uploaded successfully and are pending review.
                            </p>
                        </div>
                    )}

                    {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            <div className="col-lg-6">
                                <div className="card border rounded-4 p-4 h-100">
                                    <label className="form-label fw-semibold text-dark mb-3">Upload Card Photo</label>
                                    <div className="border border-dashed rounded-4 p-4 text-center" style={{ backgroundColor: '#f8f9fa', borderColor: '#cfd8e3' }}>
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,application/pdf"
                                            className="d-none"
                                            id="card-photo"
                                            onChange={(event) => handleFileChange(setCardPhoto, event)}
                                        />
                                        <label htmlFor="card-photo" className="d-block cursor-pointer">
                                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '52px', height: '52px', backgroundColor: '#e9efff' }}>
                                                <UploadCloud size={24} className="text-primary" />
                                            </div>
                                            <div className="fw-semibold text-dark mb-1">Click to upload</div>
                                            <small className="text-muted">PNG, JPG or PDF</small>
                                        </label>
                                        {cardPhoto && (
                                            <div className="mt-3 d-flex align-items-center justify-content-center gap-2 text-success fw-semibold small">
                                                <CheckCircle2 size={16} />
                                                {cardPhoto.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="card border rounded-4 p-4 h-100">
                                    <label className="form-label fw-semibold text-dark mb-3">Upload Selfie, holding card</label>
                                    <div className="border border-dashed rounded-4 p-4 text-center" style={{ backgroundColor: '#f8f9fa', borderColor: '#cfd8e3' }}>
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,application/pdf"
                                            className="d-none"
                                            id="selfie-photo"
                                            onChange={(event) => handleFileChange(setSelfiePhoto, event)}
                                        />
                                        <label htmlFor="selfie-photo" className="d-block cursor-pointer">
                                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '52px', height: '52px', backgroundColor: '#e9efff' }}>
                                                <UploadCloud size={24} className="text-primary" />
                                            </div>
                                            <div className="fw-semibold text-dark mb-1">Click to upload</div>
                                            <small className="text-muted">PNG, JPG or PDF</small>
                                        </label>
                                        {selfiePhoto && (
                                            <div className="mt-3 d-flex align-items-center justify-content-center gap-2 text-success fw-semibold small">
                                                <CheckCircle2 size={16} />
                                                {selfiePhoto.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-3 mt-4 flex-wrap">
                            <button
                                type="submit"
                                className="btn btn-primary py-3 px-4 fw-bold"
                                style={{ borderRadius: '12px' }}
                            >
                                Submit KYC
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-light py-3 px-4 fw-bold"
                                style={{ borderRadius: '12px', border: '1px solid #dee2e6' }}
                            >
                                <ArrowLeft size={18} className="me-2" />
                                Back to Dashboard
                            </button>
                        </div>
                    </form>
                    ) : (
                        <div className="d-flex gap-3 mt-4 flex-wrap">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-primary py-3 px-4 fw-bold"
                                style={{ borderRadius: '12px' }}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KYCPage;
