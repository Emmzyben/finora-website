import React, { useEffect } from 'react';

const HeroCarousel = () => {
    useEffect(() => {
        if (window.$ && window.$.fn.owlCarousel) {
            // Destroy any existing instance to avoid duplicates during HMR
            window.$(".header-carousel").trigger('destroy.owl.carousel');
            window.$(".header-carousel").removeClass('owl-loaded');
            window.$(".header-carousel").find('.owl-stage-outer').children().unwrap();

            // Initialize the carousel
            window.$(".header-carousel").owlCarousel({
                animateOut: 'slideOutDown',
                items: 1,
                autoplay: true,
                smartSpeed: 1000,
                dots: false,
                loop: true,
                nav: true,
                navText: [
                    '<i class="bi bi-arrow-left"></i>',
                    '<i class="bi bi-arrow-right"></i>'
                ],
            });
        }
    }, []);

    return (
        <div className="header-carousel owl-carousel">
            <div className="header-carousel-item">
                <img src="/img/investment-banking.webp" className="img-fluid w-100" alt="Image" />
                <div className="carousel-caption">
                    <div className="carousel-caption-content p-3">
                        <h5 className="text-white text-uppercase fw-bold mb-4" style={{ letterSpacing: '3px' }}>Easy & Secured Digital Banking</h5>
                        <h1 className="display-1 text-capitalize text-white mb-4">Your Money, Smarter & Safer Than Ever</h1>
                        <p className="mb-5 fs-5">Experience next-generation banking with Finora. Open an account in minutes, transact globally with ultra-low fees, and enjoy enterprise-grade security — all from your fingertips.
                        </p>
                        <a className="btn btn-primary rounded-pill text-white py-2 px-4 m-2" href="/sign-up">Open Account</a>
                        <a className="btn btn-outline-primary rounded-pill text-white py-2 px-4 m-2" href="/sign-in">Online Banking</a>
                    </div>
                </div>
            </div>
            <div className="header-carousel-item">
                <img src="/img/bank_deal.webp" className="img-fluid w-100" alt="Image" />
                <div className="carousel-caption">
                    <div className="carousel-caption-content p-3">
                        <h5 className="text-white text-uppercase fw-bold mb-4" style={{ letterSpacing: '3px' }}>Global Coverage · 80+ Countries</h5>
                        <h1 className="display-1 text-capitalize text-white mb-4">Send, Save & Invest with World-Class Speed</h1>
                        <p className="mb-5 fs-5 animated slideInDown">Transfer funds across borders in seconds, invest in global markets, and manage your finances with 24/7 real-time support — all powered by Finora's cutting-edge financial platform.
                        </p>
                        <a className="btn btn-primary rounded-pill text-white py-2 px-4 m-2" href="/sign-up">Open Account</a>
                        <a className="btn btn-outline-primary rounded-pill text-white py-2 px-4 m-2" href="/sign-in">Online Banking</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroCarousel;
