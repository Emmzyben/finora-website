import React, { useEffect } from 'react';

const testimonials = [
    {
        name: 'James Whitfield',
        location: 'New York, USA',
        rating: 5,
        text: 'Finora completely changed how I manage my investments. Transferring funds internationally used to be a nightmare — now it takes seconds. The security features give me total peace of mind.',
        initials: 'JW',
        color: '#0d6efd',
    },
    {
        name: 'Lydia Kent',
        location: 'London, United Kingdom',
        rating: 5,
        text: 'I have tried many platforms for investments but Finora stands out. Low fees, instant deposits, and their 24/7 support team is always ready to help. Highly recommended!',
        initials: ' LK',
        color: '#198754',
    },
    {
        name: 'Sophie Laurent',
        location: 'Paris, France',
        rating: 5,
        text: 'Opening my account took less than 5 minutes. The interface is clean and intuitive. I love that I can manage everything — savings, investment, and transfers — in one place.',
        initials: 'SL',
        color: '#6f42c1',
    },
    {
        name: 'Chen Wei',
        location: 'Singapore',
        rating: 5,
        text: 'The world coverage is impressive. I deal with clients in over 20 countries and Finora handles all the cross-border transactions effortlessly. Best banking decision I have ever made.',
        initials: 'CW',
        color: '#fd7e14',
    },
];

const Testimonials = () => {
    useEffect(() => {
        if (window.$ && window.$.fn.owlCarousel) {
            window.$('.testimonial-carousel').trigger('destroy.owl.carousel');
            window.$('.testimonial-carousel').removeClass('owl-loaded');
            window.$('.testimonial-carousel').find('.owl-stage-outer').children().unwrap();

            window.$('.testimonial-carousel').owlCarousel({
                autoplay: true,
                smartSpeed: 1000,
                center: true,
                dots: true,
                loop: true,
                margin: 25,
                nav: true,
                navText: [
                    '<i class="bi bi-arrow-left"></i>',
                    '<i class="bi bi-arrow-right"></i>',
                ],
                responsiveClass: true,
                responsive: {
                    0: { items: 1 },
                    768: { items: 2 },
                    1200: { items: 3 },
                },
            });
        }
    }, []);

    return (
        <div className="container-fluid testimonial py-5 wow zoomInDown" data-wow-delay="0.1s">
            <div className="container py-5">
                <div className="section-title mb-5">
                    <div className="sub-style">
                        <h4 className="sub-title text-white px-3 mb-0">Testimonials</h4>
                    </div>
                    <h1 className="display-3 mb-4 text-white">What Our Clients Are Saying</h1>
                </div>

                <div className="testimonial-carousel owl-carousel">
                    {testimonials.map((t, index) => (
                        <div key={index} className="testimonial-item">
                            <div className="testimonial-inner p-5">
                                {/* Avatar circle */}
                                <div className="testimonial-inner-img mb-4">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle mx-auto"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            background: t.color,
                                            fontSize: '1.5rem',
                                            fontWeight: '700',
                                            color: '#fff',
                                        }}
                                    >
                                        {t.initials}
                                    </div>
                                </div>

                                {/* Quote */}
                                <p className="text-white fs-6 fst-italic mb-4">
                                    "{t.text}"
                                </p>

                                {/* Name, location, stars */}
                                <div className="text-center">
                                    <h5 className="mb-1">{t.name}</h5>
                                    <p className="mb-2 text-white-50">{t.location}</p>
                                    <div className="d-flex justify-content-center gap-1">
                                        {Array.from({ length: t.rating }).map((_, i) => (
                                            <i key={i} className="fas fa-star text-warning"></i>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
