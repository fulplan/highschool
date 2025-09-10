import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/Navbar'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import WhyUs from './components/WhyUs'
import Events from './components/Events'
import Members from './components/Members'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Header />
        <Hero />
        <main id="main">
          <About />
          <WhyUs />
          <Events />
          <Members />
          <Gallery />
          <Contact />
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App