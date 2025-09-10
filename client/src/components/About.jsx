import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Heart, Users, Star } from 'lucide-react'
import Card from './Card'

const About = () => {
  const features = [
    {
      icon: Heart,
      text: "We update the general public about current activities and trending topics related to HighSchools"
    },
    {
      icon: Users,
      text: "We visit schools during SRC week celebrations, award nights, and special events"
    },
    {
      icon: Star,
      text: "Creating lasting memories and celebrating student achievements across Africa"
    }
  ]

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-dark via-dark-lighter to-dark">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src="/img/about.jpg" 
                alt="About HighSchoolive Africa" 
                className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-accent text-dark rounded-xl p-6 shadow-xl"
            >
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm">Students Reached</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              >
                HighSchoo<span className="text-accent">Live</span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-xl text-gray-300 font-light leading-relaxed"
              >
                A dynamic channel dedicated to unearthing the potential of second cycle 
                students through innovative entertainment, educational content, and 
                meaningful community engagement across Africa.
              </motion.p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <p className="text-gray-300 leading-relaxed">{feature.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {[
                { number: '50+', label: 'Schools Visited' },
                { number: '100+', label: 'Events Covered' },
                { number: '20+', label: 'Awards Given' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-accent">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About