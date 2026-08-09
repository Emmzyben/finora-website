import React from 'react';

const Appointment = () => {
    return (
        <div className="container-fluid appointment py-5">
            <div className="container py-5">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6 wow fadeInLeft" data-wow-delay="0.2">
                        <div className="section-title text-start">
                            <h4 className="sub-title pe-3 mb-0">Solutions To Your Pain</h4>
                            <h1 className="display-4 mb-4">Best Quality Services With Minimal Pain Rate</h1>
                            <p className="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat deleniti amet at atque sequi quibusdam cumque itaque repudiandae temporibus, eius nam mollitia voluptas maxime veniam necessitatibus saepe in ab? Repellat!</p>
                            <div className="row g-4">
                                <div className="col-sm-6">
                                    <div className="d-flex flex-column h-100">
                                        <div className="mb-4">
                                            <h5 className="mb-3"><i className="fa fa-check text-primary me-2"></i> Body Relaxation</h5>
                                            <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et deserunt qui cupiditate veritatis enim ducimus.</p>
                                        </div>
                                        <div className="mb-4">
                                            <h5 className="mb-3"><i className="fa fa-check text-primary me-2"></i> Body Relaxation</h5>
                                            <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et deserunt qui cupiditate veritatis enim ducimus.</p>
                                        </div>
                                        <div className="text-start mb-4">
                                            <a href="#" className="btn btn-primary rounded-pill text-white py-3 px-5">More Details</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="video h-100">
                                        <img src="/img/video-img.jpg" className="img-fluid rounded w-100 h-100" style={{ objectFit: 'cover' }} alt="" />
                                        <button type="button" className="btn btn-play" data-bs-toggle="modal" data-src="https://www.youtube.com/embed/DWRcNpR6Kdc" data-bs-target="#videoModal">
                                            <span></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 wow fadeInRight" data-wow-delay="0.4s">
                        <div className="appointment-form rounded p-5">
                            <p className="fs-4 text-uppercase text-primary">Get In Touch</p>
                            <h1 className="display-5 mb-4">Get Appointment</h1>
                            <form>
                                <div className="row gy-3 gx-4">
                                    <div className="col-xl-6">
                                        <input type="text" className="form-control py-3 border-primary bg-transparent text-white" placeholder="First Name" />
                                    </div>
                                    <div className="col-xl-6">
                                        <input type="email" className="form-control py-3 border-primary bg-transparent text-white" placeholder="Email" />
                                    </div>
                                    <div className="col-xl-6">
                                        <input type="phone" className="form-control py-3 border-primary bg-transparent" placeholder="Phone" />
                                    </div>
                                    <div className="col-xl-6">
                                        <select className="form-select py-3 border-primary bg-transparent" aria-label="Default select example">
                                            <option defaultValue>Your Gender</option>
                                            <option value="1">Male</option>
                                            <option value="2">FeMale</option>
                                            <option value="3">Others</option>
                                        </select>
                                    </div>
                                    <div className="col-xl-6">
                                        <input type="date" className="form-control py-3 border-primary bg-transparent" />
                                    </div>
                                    <div className="col-xl-6">
                                        <select className="form-select py-3 border-primary bg-transparent" aria-label="Default select example">
                                            <option defaultValue>Department</option>
                                            <option value="1">Physiotherapy</option>
                                            <option value="2">Physical Helth</option>
                                            <option value="2">Treatments</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <textarea className="form-control border-primary bg-transparent text-white" name="text" id="area-text" cols="30" rows="5" placeholder="Write Comments"></textarea>
                                    </div>
                                    <div className="col-12">
                                        <button type="button" className="btn btn-primary text-white w-100 py-3 px-5">SUBMIT NOW</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointment;
