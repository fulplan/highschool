import React from 'react'

const Header = () => {
  return (
    <header id="header" className="fixed-top d-flex align-items-center">
      <div className="container-fluid container-xl d-flex align-items-center justify-content-lg-between">
        <h1 className="logo me-auto me-lg-0">
          <a href="#hero">HighSchoolive Africa</a>
        </h1>

        <nav id="navbar" className="navbar order-last order-lg-0">
          <ul>
            <li><a className="nav-link scrollto active" href="#hero">Home</a></li>
            <li><a className="nav-link scrollto" href="#about">About</a></li>
            <li><a className="nav-link scrollto" href="#events">Events</a></li>
            <li><a className="nav-link scrollto" href="#members">Members</a></li>
            <li><a className="nav-link scrollto" href="#gallery">Gallery</a></li>
            <li className="dropdown">
              <a href="#"><span>More</span> <i className="bi bi-chevron-down"></i></a>
              <ul>
                <li><a href="#">Blog Posts</a></li>
                <li className="dropdown">
                  <a href="#"><span>Media</span><i className="bi bi-chevron-right"></i></a>
                  <ul>
                    <li><a href="/photos">Photos</a></li>
                    <li><a href="#">Videos</a></li>
                    <li><a href="#">Events</a></li>
                    <li><a href="#">Gossip</a></li>
                    <li><a href="#">GetIT Right</a></li>
                  </ul>
                </li>
                <li><a href="#">Drop Down 2</a></li>
                <li><a href="#">Drop Down 3</a></li>
                <li><a href="#">Drop Down 4</a></li>
              </ul>
            </li>
            <li><a className="nav-link scrollto" href="#contact">Contact</a></li>
          </ul>
          <i className="bi bi-list mobile-nav-toggle"></i>
        </nav>
        <a href="#events" className="book-a-table-btn scrollto d-none d-lg-flex">Event Booking</a>
      </div>
    </header>
  )
}

export default Header