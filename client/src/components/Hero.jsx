import React from 'react'

const Hero = () => {
  return (
    <section id="hero" className="d-flex align-items-center">
      <div className="container position-relative text-center text-lg-start" data-aos="zoom-in" data-aos-delay="100">
        <div className="row">
          <div className="col-lg-8">
            <h1>Welcome to <span>HighSchoolive Africa</span></h1>
            <h2>Unearthing the potential of second cycle students through entertainment</h2>
            
            <div className="btns">
              <a href="#menu" className="btn-menu animated fadeInUp scrollto">Our Gallery</a>
              <a href="#about" className="btn-book animated fadeInUp scrollto">Learn More</a>
            </div>
          </div>
          <div className="col-lg-4 d-flex align-items-center justify-content-center position-relative" data-aos="zoom-in" data-aos-delay="200">
            <a href="/video/high-intro.mp4" className="glightbox play-btn"></a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero