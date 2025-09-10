import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  ArrowUp,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})

const Footer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(newsletterSchema)
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Successfully subscribed to our newsletter!')
      reset()
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerSections = [
    {
      title: 'Useful Links',
      links: [
        { label: 'Home', href: '#hero' },
        { label: 'About us', href: '#about' },
        { label: 'Events', href: '#events' },
        { label: 'Gallery', href: '#gallery' },
        { label: 'Contact', href: '#contact' }
      ]
    },
    {
      title: 'Our Services',
      links: [
        { label: 'Event Organization', href: '#events' },
        { label: 'School Partnerships', href: '#about' },
        { label: 'Content Creation', href: '#gallery' },
        { label: 'Student Mentoring', href: '#members' },
        { label: 'Community Building', href: '#about' }
      ]
    }
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-400' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-400' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-500' }
  ]

  return (
    <footer className="relative bg-gradient-to-br from-dark via-dark-lighter to-dark text-white overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500 rounded-full filter blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-accent">
                    HighSchoolive Africa
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Empowering African students through entertainment, education, 
                    and community engagement across the continent.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-gray-300">
                      Adum, Bantama Street<br />Kumasi, Ghana
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-gray-300">+233 5410 66278</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-gray-300">info.highschoolive@gmail.com</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-300 ${social.color} transition-all duration-300 hover:bg-white/20`}
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, sectionIndex) => (
              <div key={section.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.1 }}
                >
                  <h4 className="text-lg font-semibold mb-6 text-white">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <button
                          onClick={() => {
                            const element = document.querySelector(link.href)
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' })
                            }
                          }}
                          className="text-gray-300 hover:text-accent transition-colors duration-300 text-sm flex items-center group"
                        >
                          <span className="w-2 h-2 bg-accent rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                          {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            ))}

            {/* Newsletter */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-white">
                    Stay Updated
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Subscribe to our newsletter for the latest news, events, 
                    and entertainment updates from the high school community.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="relative">
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all pr-12"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-accent hover:bg-accent/90 text-dark rounded-md transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs">{errors.email.message}</p>
                  )}
                </form>

                {/* Quick Stats */}
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">5000+</div>
                    <div className="text-xs text-gray-300">Newsletter Subscribers</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-300 text-sm">
                  &copy; {new Date().getFullYear()} <span className="text-accent font-semibold">HighSchoolive Africa</span>. All Rights Reserved.
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Designed with <Heart className="h-3 w-3 inline text-red-500" /> by{' '}
                  <a href="https://fulplan.netlify.com/" className="text-accent hover:text-accent/80 transition-colors">
                    FulPlan
                  </a>
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex space-x-4 text-xs">
                  <button className="text-gray-300 hover:text-accent transition-colors">
                    Privacy Policy
                  </button>
                  <button className="text-gray-300 hover:text-accent transition-colors">
                    Terms of Service
                  </button>
                </div>
                
                <motion.button
                  onClick={scrollToTop}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-accent/20 hover:bg-accent hover:text-dark text-accent rounded-full transition-all duration-300"
                  aria-label="Back to top"
                >
                  <ArrowUp className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer