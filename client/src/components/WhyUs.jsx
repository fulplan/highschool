import React from 'react'

const WhyUs = () => {
  return (
    <section id="why-us" className="why-us">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Why Choose HighSchoolive Africa</h2>
          <p>We are passionate about empowering young minds through entertainment and education</p>
        </div>
        
        <div className="row">
          <div className="col-lg-4">
            <div className="box" data-aos="zoom-in" data-aos-delay="100">
              <span>01</span>
              <h4>Entertainment Focus</h4>
              <p>We believe in making education and school activities fun and engaging for students.</p>
            </div>
          </div>
          
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="box" data-aos="zoom-in" data-aos-delay="200">
              <span>02</span>
              <h4>School Connections</h4>
              <p>We actively visit schools and participate in SRC week celebrations and award nights.</p>
            </div>
          </div>
          
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="box" data-aos="zoom-in" data-aos-delay="300">
              <span>03</span>
              <h4>Trending Updates</h4>
              <p>Stay informed about current activities and trending topics in the high school community.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyUs