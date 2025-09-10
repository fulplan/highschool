import React from 'react'

const Events = () => {
  return (
    <section id="events" className="events">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Events</h2>
          <p>Join us for exciting school events and celebrations</p>
        </div>
        
        <div className="events-slider swiper" data-aos="fade-up" data-aos-delay="100">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="row event-item">
                <div className="col-lg-6">
                  <img src="/img/event-1.JPG" className="img-fluid" alt="School Event" />
                </div>
                <div className="col-lg-6 pt-4 pt-lg-0 content">
                  <h3>SRC Week Celebrations</h3>
                  <div className="price">
                    <p><span>Free Entry</span></p>
                  </div>
                  <p className="fst-italic">
                    Join us for exciting SRC week celebrations featuring entertainment, competitions, and awards.
                  </p>
                  <ul>
                    <li><i className="bi bi-check-circled"></i> Student competitions</li>
                    <li><i className="bi bi-check-circled"></i> Entertainment shows</li>
                    <li><i className="bi bi-check-circled"></i> Award ceremonies</li>
                  </ul>
                  <p>
                    Experience the best of high school entertainment and celebrate student achievements with us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Events