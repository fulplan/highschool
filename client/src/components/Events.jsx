import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Star, ArrowRight } from 'lucide-react'
import Card from './Card'
import Button from './Button'

const Events = () => {
  const events = [
    {
      id: 1,
      title: 'SRC Week Celebrations',
      date: '2025-02-15',
      time: '9:00 AM - 5:00 PM',
      location: 'Various Schools Across Ghana',
      description: 'Join us for exciting SRC week celebrations featuring entertainment, competitions, and awards ceremonies.',
      image: '/img/event-1.JPG',
      price: 'Free Entry',
      features: ['Student competitions', 'Entertainment shows', 'Award ceremonies', 'Networking opportunities'],
      status: 'upcoming',
      participants: 500
    },
    {
      id: 2,
      title: 'Annual Awards Night',
      date: '2025-03-20',
      time: '6:00 PM - 11:00 PM',
      location: 'Kumasi Cultural Centre',
      description: 'Celebrating outstanding achievements and talents from students and schools across the region.',
      image: '/img/event2.jpg',
      price: 'GH₵ 50',
      features: ['Red carpet event', 'Live performances', 'Award presentations', 'Dinner included'],
      status: 'featured',
      participants: 300
    },
    {
      id: 3,
      title: 'School Visit Program',
      date: '2025-04-10',
      time: '10:00 AM - 3:00 PM',
      location: 'Partner Schools',
      description: 'Interactive sessions with students focusing on entertainment, education, and career guidance.',
      image: '/img/event3.JPG',
      price: 'Free Entry',
      features: ['Career talks', 'Interactive sessions', 'Entertainment', 'Mentorship programs'],
      status: 'upcoming',
      participants: 200
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'featured': return 'from-purple-500 to-pink-600'
      case 'upcoming': return 'from-blue-500 to-teal-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'featured': return 'Featured Event'
      case 'upcoming': return 'Upcoming'
      default: return 'Event'
    }
  }

  return (
    <section id="events" className="py-20 bg-gradient-to-br from-dark via-dark-lighter to-dark relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 border border-accent rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 border border-accent rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 border border-accent/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
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
            Upcoming <span className="text-accent">Events</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join us for exciting school events, celebrations, and community gatherings 
            that bring students together across Africa.
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {events.map((event, index) => (
            <Card key={event.id} delay={index * 0.2} className="group overflow-hidden">
              
              {/* Event Image */}
              <div className="relative h-48 mb-6 -m-6 mb-6">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent"></div>
                
                {/* Status Badge */}
                <div className={`absolute top-4 left-4 bg-gradient-to-r ${getStatusColor(event.status)} px-3 py-1 rounded-full text-white text-xs font-semibold`}>
                  {getStatusText(event.status)}
                </div>
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-dark/80 backdrop-blur-sm px-3 py-1 rounded-full text-accent text-sm font-semibold">
                  {event.price}
                </div>
              </div>

              {/* Event Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
                  {event.title}
                </h3>
                
                <p className="text-gray-300 text-sm leading-relaxed">
                  {event.description}
                </p>

                {/* Event Meta */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-2 text-accent" />
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <Clock className="h-4 w-4 mr-2 text-accent" />
                    {event.time}
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-4 w-4 mr-2 text-accent" />
                    {event.location}
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <Users className="h-4 w-4 mr-2 text-accent" />
                    {event.participants}+ Expected Participants
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white">What to Expect:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {event.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-xs text-gray-300">
                        <Star className="h-3 w-3 mr-1 text-accent" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-accent group-hover:text-dark group-hover:border-accent"
                >
                  {event.price === 'Free Entry' ? 'Register Now' : 'Book Tickets'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-accent/10 to-yellow-500/10 border-accent/20">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Want to Host an Event?
              </h3>
              <p className="text-gray-300 mb-6">
                Partner with us to create memorable experiences for students in your school or community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  Partner With Us
                </Button>
                <Button variant="secondary" size="lg">
                  View All Events
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default Events