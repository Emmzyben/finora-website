import React, { useState } from 'react';

const faqs = [
    {
        question: 'What is Finora?',
        answer: 'Finora is a company that provides a full investment service focused on the bitcoin and cryptocurrency market. We are among the best platforms to invest and grow your bitcoin and other cryptocurrency assets.',
    },
    {
        question: 'What Is a Bank Account?',
        answer: 'A bank account is a financial account maintained by a bank or other financial institution in which the financial transactions between the bank and a customer are recorded.',
    },
    {
        question: 'How do I create my account?',
        answer: 'Registration is very easy and will take a few moments to complete. Simply click the CREATE ACCOUNT button and fill in all the required fields.',
    },
    {
        question: 'How do I make a deposit?',
        answer: 'To deposit funds in your trading account is quick and simple. For your convenience you may choose one of the several available deposit methods. Login to your account, click on the DEPOSITS button in the DASHBOARD section, choose your deposit option, and follow the steps to complete your transaction.',
    },
    {
        question: 'How long does my deposit take before it reflects on my dashboard?',
        answer: 'Your deposit will be reflected immediately once it is confirmed on the blockchain network.',
    },
    {
        question: 'What Are The Requirements For a Business Loan?',
        answer: 'Lenders want proof of your business\'s incoming money. You may have to show your bank statements to the lender when you apply for a business loan. The lender reviews the statements to determine if you are a good fit for a loan. If you received a Paycheck Protection Program (PPP) loan, you need to apply separately for forgiveness.',
    },
    {
        question: 'How long does it take to process a withdrawal to an international bank?',
        answer: 'Once we receive your withdrawal request, we process it immediately and send the funds to your Bank Account.',
    },
    {
        question: 'Can I have more than two accounts?',
        answer: 'We do not allow multiple accounts except only for business purposes.',
    },
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="container-fluid py-5" style={{ background: '#f8f9fa' }}>
            <div className="container py-5">
                <div className="section-title mb-5 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="sub-style">
                        <h4 className="sub-title px-3 mb-0">FAQ</h4>
                    </div>
                    <h1 className="display-3 mb-4">Frequently Asked Questions</h1>
                    <p className="mb-0">
                        Find quick answers to the most common questions about Finora's services, accounts, and processes.
                    </p>
                </div>

                <div className="row g-5 align-items-start">
                    {/* Left column: first half */}
                    <div className="col-lg-6 wow fadeInLeft" data-wow-delay="0.2s">
                        {faqs.slice(0, 4).map((faq, index) => (
                            <div
                                key={index}
                                className="mb-3 rounded-3 overflow-hidden"
                                style={{
                                    border: '1px solid #dee2e6',
                                    boxShadow: activeIndex === index ? '0 4px 20px rgba(13,110,253,0.10)' : 'none',
                                    transition: 'box-shadow 0.3s ease',
                                }}
                            >
                                <button
                                    className="w-100 d-flex justify-content-between align-items-center p-4 fw-semibold text-start"
                                    onClick={() => toggle(index)}
                                    style={{
                                        border: 'none',
                                        background: activeIndex === index ? '#0d6efd' : '#fff',
                                        color: activeIndex === index ? '#fff' : '#212529',
                                        transition: 'background 0.3s ease, color 0.3s ease',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <span>{faq.question}</span>
                                    <i className={`fas ${activeIndex === index ? 'fa-minus' : 'fa-plus'} ms-3`}></i>
                                </button>
                                {activeIndex === index && (
                                    <div className="p-4 bg-white" style={{ borderTop: '1px solid #dee2e6' }}>
                                        <p className="mb-0 text-muted">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right column: second half */}
                    <div className="col-lg-6 wow fadeInRight" data-wow-delay="0.2s">
                        {faqs.slice(4).map((faq, index) => {
                            const realIndex = index + 4;
                            return (
                                <div
                                    key={realIndex}
                                    className="mb-3 rounded-3 overflow-hidden"
                                    style={{
                                        border: '1px solid #dee2e6',
                                        boxShadow: activeIndex === realIndex ? '0 4px 20px rgba(13,110,253,0.10)' : 'none',
                                        transition: 'box-shadow 0.3s ease',
                                    }}
                                >
                                    <button
                                        className="w-100 d-flex justify-content-between align-items-center p-4 fw-semibold text-start"
                                        onClick={() => toggle(realIndex)}
                                        style={{
                                            border: 'none',
                                            background: activeIndex === realIndex ? '#0d6efd' : '#fff',
                                            color: activeIndex === realIndex ? '#fff' : '#212529',
                                            transition: 'background 0.3s ease, color 0.3s ease',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <span>{faq.question}</span>
                                        <i className={`fas ${activeIndex === realIndex ? 'fa-minus' : 'fa-plus'} ms-3`}></i>
                                    </button>
                                    {activeIndex === realIndex && (
                                        <div className="p-4 bg-white" style={{ borderTop: '1px solid #dee2e6' }}>
                                            <p className="mb-0 text-muted">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
