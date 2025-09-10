import React from 'react'

const Gallery = () => {
  return (
    <section id="gallery" className="gallery">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Gallery</h2>
          <p>Check out some amazing moments from our events and activities</p>
        </div>
      </div>
      
      <div className="container-fluid" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-0">
          <div className="col-lg-3 col-md-4">
            <div className="gallery-item">
              <a href="/img/gallery/gallery-1.PNG" className="gallery-lightbox" data-gall="gallery-item">
                <img src="/img/gallery/gallery-1.PNG" alt="Gallery Image 1" className="img-fluid" />
              </a>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-4">
            <div className="gallery-item">
              <a href="/img/gallery/gallery-2.JPG" className="gallery-lightbox" data-gall="gallery-item">
                <img src="/img/gallery/gallery-2.JPG" alt="Gallery Image 2" className="img-fluid" />
              </a>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-4">
            <div className="gallery-item">
              <a href="/img/gallery/gallery-3.JPG" className="gallery-lightbox" data-gall="gallery-item">
                <img src="/img/gallery/gallery-3.JPG" alt="Gallery Image 3" className="img-fluid" />
              </a>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-4">
            <div className="gallery-item">
              <a href="/img/gallery/gallery-4.JPG" className="gallery-lightbox" data-gall="gallery-item">
                <img src="/img/gallery/gallery-4.JPG" alt="Gallery Image 4" className="img-fluid" />
              </a>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-4">
            <div className="gallery-item">
              <a href="/img/gallery/gallery-5.JPG" className="gallery-lightbox" data-gall="gallery-item">
                <img src="/img/gallery/gallery-5.JPG" alt="Gallery Image 5" className="img-fluid" />
              </a>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-4">
            <div className="gallery-item">
              <a href="/img/gallery/gallery-6.JPG" className="gallery-lightbox" data-gall="gallery-item">
                <img src="/img/gallery/gallery-6.JPG" alt="Gallery Image 6" className="img-fluid" />
              </a>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-4">
            <div className="gallery-item">
              <a href="/img/gallery/gallery-7.JPG" className="gallery-lightbox" data-gall="gallery-item">
                <img src="/img/gallery/gallery-7.JPG" alt="Gallery Image 7" className="img-fluid" />
              </a>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-4">
            <div className="gallery-item">
              <a href="/img/gallery/gallery-8.JPG" className="gallery-lightbox" data-gall="gallery-item">
                <img src="/img/gallery/gallery-8.JPG" alt="Gallery Image 8" className="img-fluid" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Gallery