import React from 'react';

const Contact = () => {
    const contactItems = [
        { title: 'Email', value: 'hello@finora.com', detail: 'We reply within one business day.' },
    ];

    return (
        <>
            <div className="container-fluid bg-breadcrumb py-5">
                <div className="container text-center py-5">
                    <h3 className="text-white display-3 mb-3 mt-4">Contact Us</h3>
                    <p className="text-white-50 mb-0 fs-5">We are here to help you with financing plans, questions, and next steps.</p>
                </div>
            </div>

            <div className="container-fluid contact py-5">
                <div className="container py-5">
                    <div className="row g-4 align-items-stretch">
                        <div className="col-lg-6 wow fadeInLeft" data-wow-delay="0.1s">
                            <div className="h-100 rounded-4 p-4 p-lg-5 shadow" style={{ background: 'linear-gradient(135deg,  #1da3d8 100%)', color: '#fff' }}>
                                <div className="sub-style mb-4">
                                    <h4 className="sub-title text-white px-3 mb-0">Get in Touch</h4>
                                </div>
                                <h1 className="display-5 mb-3">Let’s talk about your financial goals.</h1>
                                <p className="mb-4 text-white-50">
                                    Whether you are planning a new loan, reviewing your options, or simply need guidance, our team is ready to assist you with clear advice and dependable support.
                                </p>

                                <div className="d-flex flex-column gap-3">
                                    {contactItems.map((item, index) => (
                                        <div key={index} className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)' }}>
                                            <h5 className="mb-1 text-white">{item.title}</h5>
                                            <p className="mb-1 fw-semibold text-white">{item.value}</p>
                                            <small className="text-white-50">{item.detail}</small>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 wow fadeInRight" data-wow-delay="0.2s">
                            <div className="h-100 rounded-4 p-4 p-lg-5 shadow bg-white">
                                <h2 className="display-6 text-dark mb-2">Send us a message</h2>
                                <p className="mb-4 text-muted">
                                    Share a few details and we’ll reach out with the right next steps.
                                </p>
                                <form>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input type="text" className="form-control" id="name" placeholder="Your Name" />
                                                <label htmlFor="name">Your Name</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input type="email" className="form-control" id="email" placeholder="Your Email" />
                                                <label htmlFor="email">Your Email</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <textarea className="form-control" placeholder="Leave a message here" id="message" style={{ height: '160px' }}></textarea>
                                                <label htmlFor="message">Message</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-primary w-100 py-3">Send Message</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
