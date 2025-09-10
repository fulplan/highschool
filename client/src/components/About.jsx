import React from 'react'

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-6 order-1 order-lg-2" data-aos="zoom-in" data-aos-delay="100">
            <div className="about-img">
              <img src="/img/about.jpg" alt="About HighSchoolive Africa" />
            </div>
          </div>
          <div className="col-lg-6 pt-4 pt-lg-0 order-2 order-lg-1 content">
            <h3>HighSchooLive.</h3>
            <p className="fst-italic">
              Is a channel which aims at unearthing the potential of the second cycle student through entertainment.
            </p>
            <ul>
              <li>
                <i className="bi bi-check-circle"></i> We also update the general public of
                the current activities or trending staffs related to HighSchools
              </li>
              <li>
                <i className="bi bi-check-circle"></i> We visit schools during SRC
                week celebrations awards nights etc.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About