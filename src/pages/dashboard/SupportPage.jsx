import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, HelpCircle, Bookmark, Flag, MessageSquare, Send, Info, CheckCircle2 } from 'lucide-react';

const SupportPage = () => {
    const [form, setForm] = useState({
        title: '',
        priority: 'Low Priority',
        description: '',
    });
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [ticketId, setTicketId] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.title.trim() || !form.description.trim()) {
            setError('Please provide both a ticket title and a description before submitting.');
            setSubmitted(false);
            return;
        }

        const generatedId = `FIN-${Math.floor(1000 + Math.random() * 9000)}`;
        setTicketId(generatedId);
        setError('');
        setSubmitted(true);
        setForm({ title: '', priority: 'Low Priority', description: '' });
    };

    return (
        <div className="dashboard-content w-100 pb-5">
            <div className="mb-4">
                <h3 className="fw-bold mb-1">Support Center</h3>
                <div className="text-muted small">
                    <Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-dark">Support</span>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 mx-auto" style={{ maxWidth: '800px', backgroundColor: '#fdfcfe' }}>
                <div className="mb-5">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '32px', height: '32px', backgroundColor: '#e6f0ff' }}>
                            <MessageCircle size={18} className="text-primary" />
                        </div>
                        <h4 className="fw-bold mb-0 text-dark">Submit a Support Ticket</h4>
                    </div>
                    <p className="text-muted mb-0 ms-5">We're here to help. Tell us about your issue and we'll find a solution.</p>
                </div>

                <div className="d-flex justify-content-center mb-5">
                    <div className="d-flex align-items-center justify-content-center rounded-circle position-relative" style={{ width: '100px', height: '100px', backgroundColor: '#6c8cf8' }}>
                        <HelpCircle size={48} color="#fff" />
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger mb-4" role="alert">{error}</div>
                )}

                {submitted && (
                    <div className="alert d-flex align-items-center gap-3 mb-4" role="alert" style={{ backgroundColor: '#eafaf1', border: '1px solid #bfe9d1', color: '#0f5132' }}>
                        <CheckCircle2 size={20} className="flex-shrink-0" />
                        <div>
                            <div className="fw-bold">Ticket submitted successfully.</div>
                            <small>Your reference number is {ticketId}.</small>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label text-dark small fw-semibold mb-1">Ticket Title</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted">
                                <Bookmark size={16} />
                            </span>
                            <input type="text" name="title" value={form.title} onChange={handleChange} className="form-control border-start-0 ps-0" placeholder="Briefly describe your issue" />
                        </div>
                        <div className="form-text text-muted small mt-1">Be specific to help us understand your issue</div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-dark small fw-semibold mb-1">Priority Level</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted">
                                <Flag size={16} />
                            </span>
                            <select name="priority" value={form.priority} onChange={handleChange} className="form-select border-start-0 ps-0 text-dark">
                                <option>Low Priority</option>
                                <option>Medium Priority</option>
                                <option>High Priority</option>
                                <option>Urgent</option>
                            </select>
                        </div>
                        <div className="form-text text-muted small mt-1">Select based on urgency of your request</div>
                    </div>

                    <div className="mb-5">
                        <label className="form-label text-dark small fw-semibold mb-1">Describe Your Issue</label>
                        <div className="d-flex">
                            <div className="p-2 border border-end-0 text-muted bg-white" style={{ borderTopLeftRadius: '0.375rem', borderBottomLeftRadius: '0.375rem' }}>
                                <MessageSquare size={16} className="mt-1" />
                            </div>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="form-control border-start-0 ps-0"
                                rows="5"
                                placeholder="Please provide all relevant details about your issue so we can help you better"
                                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                            ></textarea>
                        </div>
                        <div className="form-text text-muted small mt-1">Include any relevant details that might help us resolve your issue</div>
                    </div>

                    <div className="alert d-flex gap-3 align-items-center py-3 px-4 mb-4" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '8px' }}>
                        <Info size={20} className="text-primary flex-shrink-0" />
                        <span className="small text-muted">
                            Our support team typically responds within <span className="fw-bold">24 hours</span> during business days.
                        </span>
                    </div>

                    <div className="text-end">
                        <button type="submit" className="btn btn-primary fw-bold px-5 py-2 d-inline-flex align-items-center gap-2" style={{ backgroundColor: '#0047a5', border: 'none', borderRadius: '8px' }}>
                            <Send size={16} /> Submit Ticket
                        </button>
                    </div>
                </form>
            </div>

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

export default SupportPage;



