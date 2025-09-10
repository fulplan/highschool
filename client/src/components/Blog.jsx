import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Calendar, Clock, User, Tag, TrendingUp, BookOpen, Users } from 'lucide-react'
import BlogCard from './BlogCard'
import { blogPosts, getFeaturedPosts, getTrendingPosts } from '../data/blogData'

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')


  const categories = [
    { id: 'all', label: 'All Posts', icon: BookOpen, count: blogPosts.length },
    { id: 'academics', label: 'Academics', icon: BookOpen, count: blogPosts.filter(post => post.category === 'academics').length },
    { id: 'lifestyle', label: 'Lifestyle', icon: Users, count: blogPosts.filter(post => post.category === 'lifestyle').length },
    { id: 'career', label: 'Career', icon: TrendingUp, count: blogPosts.filter(post => post.category === 'career').length },
    { id: 'wellness', label: 'Wellness', icon: User, count: blogPosts.filter(post => post.category === 'wellness').length },
    { id: 'technology', label: 'Technology', icon: Tag, count: blogPosts.filter(post => post.category === 'technology').length },
    { id: 'leadership', label: 'Leadership', icon: Users, count: blogPosts.filter(post => post.category === 'leadership').length }
  ]

  // Filter posts based on category and search
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const featuredPosts = getFeaturedPosts()
  const trendingPosts = getTrendingPosts()

  return (
    <section id="blog" className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              HighSchool<span className="text-accent">ive</span> Blog
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Insights, tips, and stories to help African high school students thrive academically, 
              socially, and personally on their journey to success.
            </p>
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative max-w-md mx-auto"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all duration-300"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            {/* Categories */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-accent" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-accent text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-2" />
                        <span className="font-medium">{category.label}</span>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        selectedCategory === category.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Trending Posts */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-accent" />
                Trending
              </h3>
              <div className="space-y-4">
                {trendingPosts.map((post, index) => (
                  <div key={post.id} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-accent text-white text-sm font-bold rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 leading-tight mb-1 line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Posts */}
            {selectedCategory === 'all' && searchQuery === '' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-accent" />
                  Featured Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPosts.map((post, index) => (
                    <BlogCard 
                      key={post.id} 
                      post={post} 
                      featured={true}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* All Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'Latest Articles' : `${categories.find(c => c.id === selectedCategory)?.label} Articles`}
                </h2>
                <span className="text-gray-500">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredPosts.map((post, index) => (
                    <BlogCard 
                      key={post.id} 
                      post={post} 
                      featured={false}
                      delay={index * 0.05}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-500">Try adjusting your search or category filter.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Blog