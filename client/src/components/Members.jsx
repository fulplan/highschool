import React from 'react'

const Members = () => {
  return (
    <section id="members" className="members">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Our Team</h2>
          <p>Meet the passionate team behind HighSchoolive Africa</p>
        </div>
        
        <div className="row">
          <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
            <div className="member" data-aos="fade-up" data-aos-delay="100">
              <div className="member-img">
                <img src="/img/members/member-1.jpg" className="img-fluid" alt="Team Member" />
                <div className="social">
                  <a href="#"><i className="bi bi-twitter"></i></a>
                  <a href="#"><i className="bi bi-facebook"></i></a>
                  <a href="#"><i className="bi bi-instagram"></i></a>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
              <div className="member-info">
                <h4>Team Member 1</h4>
                <span>Content Creator</span>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
            <div className="member" data-aos="fade-up" data-aos-delay="200">
              <div className="member-img">
                <img src="/img/members/member-2.jpg" className="img-fluid" alt="Team Member" />
                <div className="social">
                  <a href="#"><i className="bi bi-twitter"></i></a>
                  <a href="#"><i className="bi bi-facebook"></i></a>
                  <a href="#"><i className="bi bi-instagram"></i></a>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
              <div className="member-info">
                <h4>Team Member 2</h4>
                <span>Event Coordinator</span>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
            <div className="member" data-aos="fade-up" data-aos-delay="300">
              <div className="member-img">
                <img src="/img/members/member-3.JPG" className="img-fluid" alt="Team Member" />
                <div className="social">
                  <a href="#"><i className="bi bi-twitter"></i></a>
                  <a href="#"><i className="bi bi-facebook"></i></a>
                  <a href="#"><i className="bi bi-instagram"></i></a>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
              <div className="member-info">
                <h4>Team Member 3</h4>
                <span>Media Producer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Members