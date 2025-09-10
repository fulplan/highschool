import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Calendar, Users, Trophy, Camera, BookOpen, Phone, Home, User } from 'lucide-react'

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    const handleSectionChange = () => {
      if (location.pathname === '/') {
        const sections = ['hero', 'about', 'events', 'members', 'gallery', 'contact']
        const current = sections.find(section => {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            return rect.top <= 100 && rect.bottom >= 100
          }
          return false
        })
        if (current) setActiveSection(current)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('scroll', handleSectionChange)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleSectionChange)
    }
  }, [location.pathname])

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsOpen(false)
    setEventsDropdownOpen(false)
  }

  const handlePageNavigation = (path) => {
    navigate(path)
    setIsOpen(false)
    setEventsDropdownOpen(false)
  }

  const navLinks = [
    { id: 'hero', label: 'Home', type: 'section', icon: Home },
    { id: 'about', label: 'About', type: 'section', icon: User },
    { id: 'events', label: 'Events', type: 'dropdown', icon: Calendar },
    { id: 'members', label: 'Members', type: 'section', icon: Users },
    { id: 'gallery', label: 'Gallery', type: 'section', icon: Camera },
    { id: 'contact', label: 'Contact', type: 'section', icon: Phone },
    { id: 'blog', label: 'Blog', type: 'page', path: '/blog', icon: BookOpen }
  ]

  const eventSubItems = [
    { id: 'academic-events', label: 'Academic Events', icon: Trophy, description: 'Competitions & Awards' },
    { id: 'cultural-events', label: 'Cultural Events', icon: Users, description: 'Festivals & Shows' },
    { id: 'sports-events', label: 'Sports Events', icon: Trophy, description: 'Games & Tournaments' },
    { id: 'workshops', label: 'Workshops', icon: BookOpen, description: 'Skills & Learning' }
  ]

  const logoVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  }

  const linkVariants = {
    hover: {
      y: -2,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: {
      scale: 0.98
    }
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <motion.div
            variants={logoVariants}
            whileHover="hover"
            className="flex items-center space-x-3"
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-white font-bold text-xl">H</span>
              </motion.div>
              <div>
                <motion.h1 
                  className="text-xl font-bold text-gray-900 leading-tight tracking-tight"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  HighSchoolive
                </motion.h1>
                <motion.p 
                  className="text-xs text-blue-600 font-medium tracking-wide uppercase"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Africa
                </motion.p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path || 
                            (location.pathname === '/' && activeSection === link.id) ||
                            (location.pathname.startsWith('/blog') && link.id === 'blog')
              
              if (link.type === 'dropdown') {
                return (
                  <div key={link.id} className="relative">
                    <motion.button
                      variants={linkVariants}
                      whileHover="hover"
                      onClick={() => setEventsDropdownOpen(!eventsDropdownOpen)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-base transition-all duration-200 group ${
                        isActive 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <Icon className={`h-4 w-4 transition-transform duration-200 ${eventsDropdownOpen ? 'rotate-12' : 'group-hover:scale-110'}`} />
                      <span>{link.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${eventsDropdownOpen ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                      {eventsDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50"
                        >
                          {eventSubItems.map((item, idx) => {
                            const SubIcon = item.icon
                            return (
                              <motion.button
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => scrollToSection('events')}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors group"
                              >
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                  <SubIcon className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                                  <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                              </motion.button>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              return (
                <motion.div
                  key={link.id}
                  variants={linkVariants}
                  whileHover="hover"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.type === 'page' ? (
                    <Link
                      to={link.path}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-base transition-all duration-200 group ${
                        isActive 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      <span>{link.label}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-base transition-all duration-200 group ${
                        isActive 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      <span>{link.label}</span>
                    </button>
                  )}
                </motion.div>
              )
            })}
          </nav>

          {/* Book Event Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => scrollToSection('events')}
              className="hidden lg:flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Calendar className="h-4 w-4" />
              <span>Book Event</span>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6 text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-gray-100 py-4 overflow-hidden"
            >
              <div className="space-y-2">
                {navLinks.map((link, index) => {
                  const Icon = link.icon
                  const isActive = location.pathname === link.path || 
                                (location.pathname === '/' && activeSection === link.id) ||
                                (location.pathname.startsWith('/blog') && link.id === 'blog')

                  if (link.type === 'dropdown') {
                    return (
                      <div key={link.id} className="space-y-2">
                        <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setEventsDropdownOpen(!eventsDropdownOpen)}
                          className="w-full flex items-center justify-between p-3 rounded-xl text-left font-medium transition-colors hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-900">{link.label}</span>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${eventsDropdownOpen ? 'rotate-180' : ''}`} />
                        </motion.button>
                        
                        <AnimatePresence>
                          {eventsDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-4 space-y-1 overflow-hidden"
                            >
                              {eventSubItems.map((item, idx) => {
                                const SubIcon = item.icon
                                return (
                                  <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => scrollToSection('events')}
                                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors"
                                  >
                                    <SubIcon className="h-4 w-4 text-blue-600" />
                                    <div>
                                      <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                                      <p className="text-xs text-gray-500">{item.description}</p>
                                    </div>
                                  </motion.button>
                                )
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  }

                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {link.type === 'page' ? (
                        <Link
                          to={link.path}
                          className={`flex items-center space-x-3 p-3 rounded-xl font-medium transition-colors ${
                            isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{link.label}</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => scrollToSection(link.id)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium text-left transition-colors ${
                            isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{link.label}</span>
                        </button>
                      )}
                    </motion.div>
                  )
                })}
                
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  onClick={() => scrollToSection('events')}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white p-4 rounded-xl font-semibold mt-4"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Event</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Navigation