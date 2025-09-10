import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Users, TrendingUp, Award } from 'lucide-react'
import Card from './Card'

const WhyUs = () => {
  const features = [
    {
      icon: Sparkles,
      number: '01',
      title: 'Entertainment Focus',
      description: 'We believe in making education and school activities fun and engaging for students through innovative entertainment approaches.',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: Users,
      number: '02',
      title: 'School Connections',
      description: 'We actively visit schools and participate in SRC week celebrations, award nights, and create lasting community bonds.',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: TrendingUp,
      number: '03',
      title: 'Trending Updates',
      description: 'Stay informed about current activities and trending topics in the high school community across Africa.',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: Award,
      number: '04',
      title: 'Excellence Recognition',
      description: 'Celebrating and recognizing outstanding achievements, talents, and contributions from students and schools.',
      gradient: 'from-purple-500 to-pink-600'
    }
  ]

  return (
    <section id="why-us" className="py-20 bg-gradient-to-br from-dark-lighter via-dark to-dark-lighter relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(205, 164, 94, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose <span className="text-accent">HighSchoolive Africa</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We are passionate about empowering young minds through entertainment, 
            education, and meaningful connections across the African continent.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} delay={index * 0.2} className="group relative">
              
              {/* Number Badge */}
              <div className={`absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                {feature.number}
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-accent/10 to-yellow-500/10 rounded-2xl p-8 border border-accent/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Join Our Community?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Connect with us and be part of the movement that's transforming 
              high school experiences across Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-accent hover:bg-accent/90 text-dark font-semibold px-8 py-3 rounded-full transition-all duration-300"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get In Touch
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-accent text-accent hover:bg-accent hover:text-dark font-semibold px-8 py-3 rounded-full transition-all duration-300"
                onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Events
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhyUs