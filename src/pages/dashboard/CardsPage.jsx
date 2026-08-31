import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    CreditCard, Hourglass, Wallet, ShieldCheck, SlidersHorizontal,
    Globe, Zap, FileText, CheckCircle2, ShoppingCart, Plus
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

const CardsPage = () => {
    const [cards, setCards] = useState([]);
    const [activeCards, setActiveCards] = useState(0);
    const [pendingCards, setPendingCards] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCards = async () => {
            try {
                const response = await apiRequest('cards');
                setCards(response.cards || []);
                setActiveCards(response.active_cards || 0);
                setPendingCards(response.pending_cards || 0);
                setTotalBalance(response.total_balance || 0);
            } catch (error) {
                console.error('Failed to load cards:', error);
                setCards([]);
            } finally {
                setLoading(false);
            }
        };

        loadCards();
    }, []);

    return (
        <div className="dashboard-content w-100">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <div className="text-muted small mb-2">
                        <Link to="/dashboard" className="text-muted text-decoration-none hover-primary">Dashboard</Link>
                        <span className="mx-2">&gt;</span>
                        <span className="text-dark">Cards</span>
                    </div>
                    <h3 className="fw-bold mb-0">Virtual Cards</h3>
                </div>
                <Link to="/dashboard/cards/apply" className="btn btn-primary d-flex align-items-center px-4 py-2" style={{ backgroundColor: '#023888', border: 'none', textDecoration: 'none' }}>
                    <Plus size={18} className="me-2" /> Apply for Card
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-3 p-4 h-100 d-flex flex-row align-items-center">
                        <div className="rounded-3 d-flex justify-content-center align-items-center me-4" style={{ width: '56px', height: '56px', backgroundColor: '#6c8cf8', color: 'white' }}>
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <small className="text-muted d-block mb-1">Active Cards</small>
                            <h4 className="mb-0 fw-bold">{activeCards}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-3 p-4 h-100 d-flex flex-row align-items-center">
                        <div className="rounded-3 d-flex justify-content-center align-items-center me-4" style={{ width: '56px', height: '56px', backgroundColor: '#e2ebfa', color: '#6c8cf8' }}>
                            <Hourglass size={24} />
                        </div>
                        <div>
                            <small className="text-muted d-block mb-1">Pending Applications</small>
                            <h4 className="mb-0 fw-bold">{pendingCards}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-3 p-4 h-100 d-flex flex-row align-items-center">
                        <div className="rounded-3 d-flex justify-content-center align-items-center me-4" style={{ width: '56px', height: '56px', backgroundColor: '#e8fdf0', color: '#198754' }}>
                            <Wallet size={24} />
                        </div>
                        <div>
                            <small className="text-muted d-block mb-1">Total Card Balance</small>
                            <h4 className="mb-0 fw-bold">${Number(totalBalance).toFixed(2)}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Banner Section */}
            <div className="card border-0 shadow-sm text-white mb-5 position-relative overflow-hidden" style={{ borderRadius: '16px', backgroundColor: '#023888', background: 'linear-gradient(135deg, #023888 0%, #0352c7 100%)' }}>
                <div className="row g-0">
                    <div className="col-lg-7 p-4 p-md-5">
                        <h3 className="fw-bold mb-3 text-white">Virtual Cards Made Easy</h3>
                        <p className="mb-4 text-white-50" style={{ maxWidth: '600px' }}>
                            Create virtual cards for secure online payments, subscription management, and more. Our virtual cards offer enhanced security and control over your spending.
                        </p>

                        <div className="row g-4 mb-4">
                            <div className="col-sm-6 d-flex">
                                <ShieldCheck className="me-3 mt-1 flex-shrink-0" style={{ color: '#a2bdfa' }} size={24} />
                                <div>
                                    <h6 className="fw-bold mb-1 text-white">Secure Payments</h6>
                                    <small className="text-white-50">Protect your main account with separate virtual cards</small>
                                </div>
                            </div>
                            <div className="col-sm-6 d-flex">
                                <Globe className="me-3 mt-1 flex-shrink-0" style={{ color: '#a2bdfa' }} size={24} />
                                <div>
                                    <h6 className="fw-bold mb-1 text-white">Global Acceptance</h6>
                                    <small className="text-white-50">Use anywhere major cards are accepted online</small>
                                </div>
                            </div>
                            <div className="col-sm-6 d-flex">
                                <SlidersHorizontal className="me-3 mt-1 flex-shrink-0" style={{ color: '#a2bdfa' }} size={24} />
                                <div>
                                    <h6 className="fw-bold mb-1 text-white">Spending Controls</h6>
                                    <small className="text-white-50">Set limits and monitor transactions in real-time</small>
                                </div>
                            </div>
                            <div className="col-sm-6 d-flex">
                                <Zap className="me-3 mt-1 flex-shrink-0" style={{ color: '#a2bdfa' }} size={24} />
                                <div>
                                    <h6 className="fw-bold mb-1 text-white">Instant Issuance</h6>
                                    <small className="text-white-50">Create and use cards within minutes</small>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-light bg-white text-primary px-4 py-2 fw-bold rounded-3">
                            Apply Now
                        </button>
                    </div>
                    <div className="col-lg-5 d-none d-lg-flex align-items-center justify-content-center position-relative">
                        {/* Decorative background shapes */}
                        <div className="position-absolute rounded-circle" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)', top: '10%', right: '10%' }}></div>

                        {/* Virtual Card Illustration */}
                        <div className="card shadow border-0" style={{ width: '320px', height: '200px', background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', borderRadius: '16px', zIndex: 1, transform: 'perspective(1000px) rotateY(-15deg) rotateX(5deg)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="card-body p-4 d-flex flex-column h-100 justify-content-between text-white">
                                <div className="d-flex justify-content-between align-items-start">
                                    <h5 className="fw-bold mb-0 text-white" style={{ letterSpacing: '1px' }}>Virtual Card</h5>
                                    <Globe className="opacity-50" size={24} />
                                </div>
                                <div>
                                    <h4 className="fw-bold mb-3 text-white letter-spacing-2" style={{ letterSpacing: '4px' }}>•••• •••• •••• 1234</h4>
                                    <div className="d-flex justify-content-between align-items-end">
                                        <div>
                                            <small className="text-white-50 d-block mb-1" style={{ fontSize: '0.65rem' }}>VALID THRU</small>
                                            <span className="fw-bold">12/25</span>
                                        </div>
                                        <CreditCard size={32} strokeWidth={1.5} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Your Cards Section */}
            <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '12px' }}>
                <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Your Cards</h5>
                    <button className="btn btn-link text-primary text-decoration-none fw-bold p-0 d-flex align-items-center">
                        <Plus size={18} className="me-1" /> New Card
                    </button>
                </div>
                <div className="card-body py-4">
                    {loading ? (
                        <div className="text-center py-4 text-muted">Loading cards...</div>
                    ) : cards.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="mb-3">
                                <div className="d-inline-flex justify-content-center align-items-center bg-light rounded-circle" style={{ width: '80px', height: '80px' }}>
                                    <CreditCard className="text-muted" style={{ fontSize: '2.5rem' }} size={40} strokeWidth={1.5} />
                                </div>
                            </div>
                            <h5 className="fw-bold mb-2">No cards yet</h5>
                            <p className="text-muted mx-auto mb-4" style={{ maxWidth: '400px' }}>You haven't applied for any virtual cards yet. Apply for a new card to get started with secure online payments.</p>
                            <Link to="/dashboard/cards/apply" className="btn btn-primary px-4 py-2 fw-bold" style={{ backgroundColor: '#023888', border: 'none', textDecoration: 'none' }}>
                                Apply for Card
                            </Link>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {cards.map((card) => (
                                <div key={card.id} className="col-md-6 col-xl-4">
                                    <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: 'linear-gradient(135deg, #023888 0%, #0352c7 100%)' }}>
                                        <div className="card-body p-4 text-white">
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <span className="fw-bold text-uppercase">{card.card_type}</span>
                                                <span className="badge rounded-pill  bg-opacity-10 px-3 py-2" style={{ textTransform: 'capitalize' }}>{card.status}</span>
                                            </div>
                                            <div className="mb-4 fw-bold" style={{ letterSpacing: '3px' }}>{card.card_number}</div>
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
                    )}
                </div>
            </div>

            {/* How it works */}
            <h4 className="fw-bold mb-4">How Virtual Cards Work</h4>
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm rounded-3 p-4">
                        <div className="bg-primary bg-opacity-10 text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-4" style={{ width: '48px', height: '48px' }}>
                            <FileText size={24} />
                        </div>
                        <h5 className="fw-bold mb-3">1. Apply</h5>
                        <p className="text-muted mb-0">Complete the application form for your virtual card. Select your preferred card type and set your spending limits.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm rounded-3 p-4">
                        <div className="bg-primary bg-opacity-10 text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-4" style={{ width: '48px', height: '48px' }}>
                            <CheckCircle2 size={24} />
                        </div>
                        <h5 className="fw-bold mb-3">2. Activate</h5>
                        <p className="text-muted mb-0">Once approved, your virtual card will be ready to use. View the card details and activate it from your dashboard.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm rounded-3 p-4">
                        <div className="bg-primary bg-opacity-10 text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-4" style={{ width: '48px', height: '48px' }}>
                            <ShoppingCart size={24} />
                        </div>
                        <h5 className="fw-bold mb-3">3. Use</h5>
                        <p className="text-muted mb-0">Use your virtual card for online transactions anywhere major credit cards are accepted. Monitor transactions in real-time.</p>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="card border-0 shadow-sm rounded-3 p-4 p-md-5 mb-5">
                <h4 className="fw-bold mb-4">Frequently Asked Questions</h4>

                <div className="mb-4">
                    <h6 className="fw-bold mb-2">What is a virtual card?</h6>
                    <p className="text-muted mb-0">A virtual card is a digital payment card that can be used for online transactions. It works just like a physical card but exists only in digital form, providing enhanced security for online purchases.</p>
                </div>

                <div className="mb-4">
                    <h6 className="fw-bold mb-2">How secure are virtual cards?</h6>
                    <p className="text-muted mb-0">Virtual cards offer additional security as they're separate from your primary account. You can create cards with specific spending limits and even create single-use cards for enhanced protection against fraud.</p>
                </div>

                <div className="mb-4">
                    <h6 className="fw-bold mb-2">Can I have multiple virtual cards?</h6>
                    <p className="text-muted mb-0">Yes, you can apply for multiple virtual cards for different purposes - such as one for subscriptions, another for shopping, etc. Each card can have its own limits and settings.</p>
                </div>

                <div>
                    <h6 className="fw-bold mb-2">How long does it take to get a virtual card?</h6>
                    <p className="text-muted mb-0">Virtual cards are typically issued within minutes after approval. Once approved, you can immediately view and use the card details for online transactions.</p>
                </div>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top text-muted small pb-4">
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

export default CardsPage;



