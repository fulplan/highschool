import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Eye, ArrowRight, BookOpen } from 'lucide-react'

const BlogCard = ({ post, featured = false, delay = 0 }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay }
    }
  }

  const imageVariants = {
    hover: { scale: 1.05 }
  }

  const contentVariants = {
    hover: { y: -2 }
  }

  return (
    <Link to={`/blog/${post.id}`} className="block">
      <motion.article
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        whileHover="hover"
        className={`group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer ${
          featured ? 'md:col-span-1' : ''
        }`}
      >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100">
        <motion.div
          variants={imageVariants}
          className="aspect-[16/10] bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center"
        >
          {/* Placeholder for actual image */}
          <BookOpen className="h-12 w-12 text-accent/60" />
          {/* Uncomment when images are available:
          <motion.img
            variants={imageVariants}
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          */}
        </motion.div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-accent font-medium text-sm rounded-full">
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </span>
        </div>

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-accent text-white font-medium text-sm rounded-full">
              Featured
            </span>
          </div>
        )}

        {/* Views Badge */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center space-x-1 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
            <Eye className="h-3 w-3" />
            <span>{post.views.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div variants={contentVariants} className="p-6">
        {/* Meta Information */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(post.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors duration-200 line-clamp-2 ${
          featured ? 'text-xl' : 'text-lg'
        }`}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author and Read More */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author}</p>
              <p className="text-xs text-gray-500">{post.authorRole}</p>
            </div>
          </div>
          
          <motion.div 
            className="flex items-center space-x-1 text-accent font-medium text-sm group-hover:space-x-2 transition-all duration-200"
            whileHover={{ x: 2 }}
          >
            <span>Read More</span>
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </div>
      </motion.div>
    </motion.article>
    </Link>
  )
}

export default BlogCard