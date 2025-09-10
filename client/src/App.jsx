import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import WhyUs from './components/WhyUs'
import Events from './components/Events'
import Members from './components/Members'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { Toaster } from 'sonner'

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-dark text-white">
        <Navigation />
        <Hero />
        <main>
          <About />
          <WhyUs />
          <Events />
          <Members />
          <Gallery />
          <Contact />
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App