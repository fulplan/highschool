import React from 'react'
import { motion } from 'framer-motion'
import { Star, Award, Users, Heart } from 'lucide-react'
import Card from './Card'

const Members = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Osei',
      role: 'Content Creator & Host',
      image: '/img/members/member-1.jpg',
      bio: 'Passionate about youth empowerment and creating engaging content that resonates with high school students.',
      skills: ['Content Creation', 'Public Speaking', 'Event Hosting'],
      achievements: ['50+ Events Hosted', '10K+ Students Reached'],
      social: {
        twitter: '#',
        facebook: '#',
        instagram: '#',
        linkedin: '#'
      },
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 2,
      name: 'Kwame Asante',
      role: 'Event Coordinator',
      image: '/img/members/member-2.jpg',
      bio: 'Expert in organizing large-scale events and building partnerships with schools across Ghana.',
      skills: ['Event Planning', 'Partnership Building', 'Project Management'],
      achievements: ['100+ Events Organized', '30+ School Partnerships'],
      social: {
        twitter: '#',
        facebook: '#',
        instagram: '#',
        linkedin: '#'
      },
      gradient: 'from-blue-500 to-teal-600'
    },
    {
      id: 3,
      name: 'Ama Mensah',
      role: 'Media Producer',
      image: '/img/members/member-3.JPG',
      bio: 'Creative visual storyteller specializing in capturing the essence of student life and achievements.',
      skills: ['Video Production', 'Photography', 'Graphic Design'],
      achievements: ['500+ Videos Produced', '1M+ Views Generated'],
      social: {
        twitter: '#',
        facebook: '#',
        instagram: '#',
        linkedin: '#'
      },
      gradient: 'from-green-500 to-blue-600'
    }
  ]

  const stats = [
    { icon: Users, number: '15+', label: 'Team Members', color: 'text-blue-400' },
    { icon: Star, number: '500+', label: 'Events Covered', color: 'text-yellow-400' },
    { icon: Award, number: '50+', label: 'Awards Given', color: 'text-purple-400' },
    { icon: Heart, number: '10K+', label: 'Students Impacted', color: 'text-red-400' }
  ]

  return (
    <section id="members" className="py-20 bg-gradient-to-br from-dark-lighter via-dark to-dark-lighter relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-accent rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl"></div>
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
            Meet Our <span className="text-accent">Team</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The passionate individuals behind HighSchoolive Africa, dedicated to 
            empowering students and creating unforgettable experiences.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <Card key={index} delay={index * 0.1} className="text-center group">
              <div className="space-y-3">
                <div className={`w-12 h-12 mx-auto bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-300">
                  {stat.label}
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Team Members */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {teamMembers.map((member, index) => (
            <Card key={member.id} delay={index * 0.2} className="group text-center overflow-hidden">
              
              {/* Member Image */}
              <div className="relative mb-6 -m-6 mb-6">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Social Links Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-3">
                    {Object.entries(member.social).map(([platform, url]) => (
                      <motion.a
                        key={platform}
                        href={url}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-accent/90 backdrop-blur-sm rounded-full flex items-center justify-center text-dark hover:bg-accent transition-colors"
                      >
                        {platform === 'twitter' && '🐦'}
                        {platform === 'facebook' && '📘'}
                        {platform === 'instagram' && '📷'}
                        {platform === 'linkedin' && '💼'}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="space-y-4 p-6 -m-6 mt-0">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
                    {member.name}
                  </h3>
                  <p className={`text-sm font-medium bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                    {member.role}
                  </p>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {member.bio}
                </p>

                {/* Skills */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Expertise:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-accent/20 text-accent text-xs rounded-full border border-accent/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Achievements:</h4>
                  <div className="space-y-1">
                    {member.achievements.map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex items-center justify-center text-xs text-gray-300">
                        <Star className="h-3 w-3 mr-1 text-accent" />
                        {achievement}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Join Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-accent/10 to-blue-500/10 border-accent/20">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Join Our Team
              </h3>
              <p className="text-gray-300 mb-6">
                Are you passionate about empowering students and creating positive change? 
                We're always looking for talented individuals to join our mission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-accent hover:bg-accent/90 text-dark font-semibold px-8 py-3 rounded-full transition-all duration-300"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Apply Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-accent text-accent hover:bg-accent hover:text-dark font-semibold px-8 py-3 rounded-full transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default Members