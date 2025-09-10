import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react'

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [filter, setFilter] = useState('all')
  const [announcement, setAnnouncement] = useState('')
  
  const modalRef = useRef(null)
  const triggerElementRef = useRef(null)
  const closeButtonRef = useRef(null)
  const prevButtonRef = useRef(null)
  const nextButtonRef = useRef(null)

  const images = [
    { src: '/img/gallery/doom/gallery-1.PNG', category: 'events', title: 'School Event 1' },
    { src: '/img/gallery/gallery-2.JPG', category: 'activities', title: 'Student Activities' },
    { src: '/img/gallery/gallery-3.JPG', category: 'events', title: 'Award Ceremony' },
    { src: '/img/gallery/gallery-4.JPG', category: 'activities', title: 'Fun Activities' },
    { src: '/img/gallery/gallery-5.JPG', category: 'events', title: 'SRC Week' },
    { src: '/img/gallery/gallery-6.JPG', category: 'activities', title: 'Student Life' },
    { src: '/img/gallery/gallery-7.JPG', category: 'events', title: 'Celebration' },
    { src: '/img/gallery/gallery-8.JPG', category: 'activities', title: 'Community' }
  ]

  // Navigation functions
  const navigateToImage = (direction) => {
    const currentIndex = images.findIndex(img => img.src === selectedImage.src)
    let newIndex
    
    if (direction === 'next') {
      newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    } else {
      newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    }
    
    const newImage = images[newIndex]
    setSelectedImage(newImage)
    setSelectedImageIndex(newIndex)
    setAnnouncement(`Image ${newIndex + 1} of ${images.length}: ${newImage.title}`)
  }

  const openLightbox = (image, index, triggerElement) => {
    setSelectedImage(image)
    setSelectedImageIndex(index)
    triggerElementRef.current = triggerElement
    setAnnouncement(`Opened lightbox. Image ${index + 1} of ${images.length}: ${image.title}. Use arrow keys to navigate, Escape to close.`)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    setAnnouncement('Lightbox closed')
    
    // Restore focus to triggering element
    if (triggerElementRef.current) {
      triggerElementRef.current.focus()
      triggerElementRef.current = null
    }
  }

  // Get focusable elements within modal for focus trap
  const getFocusableElements = () => {
    if (!modalRef.current) return []
    
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ]
    
    return Array.from(modalRef.current.querySelectorAll(focusableSelectors.join(', ')))
  }

  // Handle keyboard navigation and focus trap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return

      // Handle navigation keys
      if (e.key === 'Escape') {
        closeLightbox()
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        navigateToImage('prev')
        return
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        navigateToImage('next')
        return
      }

      // Focus trap - handle Tab navigation within modal
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements()
        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          // Shift+Tab (backwards)
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab (forwards)
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage, images])

  // Focus management when modal opens
  useEffect(() => {
    if (selectedImage && closeButtonRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 100)
    }
  }, [selectedImage])

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'events', label: 'Events' },
    { id: 'activities', label: 'Activities' }
  ]

  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.category === filter)

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-dark via-dark-lighter to-dark">
      <div className="container mx-auto px-4">
        
        {/* ARIA Live Region for Screen Reader Announcements */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="text-accent">Gallery</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore amazing moments from our events, activities, and celebrations 
            across schools in Africa.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <div className="flex space-x-2 bg-white/5 backdrop-blur-sm rounded-full p-2 border border-white/10">
            {filters.map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  filter === filterOption.id
                    ? 'bg-accent text-dark'
                    : 'text-white hover:text-accent hover:bg-white/10'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.src}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-accent/30 transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold mb-2">{image.title}</h3>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => openLightbox(image, index, e.currentTarget)}
                        className="p-2 bg-accent/20 backdrop-blur-sm rounded-full text-accent hover:bg-accent hover:text-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                        aria-label={`View ${image.title} in fullscreen`}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-accent/20 backdrop-blur-sm rounded-full text-accent hover:bg-accent hover:text-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                        aria-label={`Like ${image.title}`}
                      >
                        <Heart className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-accent/20 backdrop-blur-sm rounded-full text-accent hover:bg-accent hover:text-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                        aria-label={`Share ${image.title}`}
                      >
                        <Share2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            aria-describedby="lightbox-description"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl max-h-[90vh] bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden focus:outline-none"
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-full object-contain"
                loading="eager"
              />
              
              {/* Navigation Buttons */}
              <button
                ref={prevButtonRef}
                onClick={() => navigateToImage('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-dark/50 backdrop-blur-sm rounded-full text-white hover:bg-dark/70 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                ref={nextButtonRef}
                onClick={() => navigateToImage('next')}
                className="absolute right-16 top-1/2 -translate-y-1/2 p-3 bg-dark/50 backdrop-blur-sm rounded-full text-white hover:bg-dark/70 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              <button
                ref={closeButtonRef}
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-2 bg-dark/50 backdrop-blur-sm rounded-full text-white hover:bg-dark/70 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Close image viewer"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/80 to-transparent p-6">
                <h3 id="lightbox-title" className="text-white text-xl font-semibold">
                  {selectedImage.title}
                </h3>
                <p id="lightbox-description" className="text-gray-300 text-sm mt-1">
                  Image {selectedImageIndex + 1} of {images.length}. Use arrow keys to navigate, Escape to close.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Gallery