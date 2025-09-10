import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, User, Eye, ArrowRight, BookOpen, Heart, Share2, Bookmark, MessageCircle, Sparkles, TrendingUp, Zap } from 'lucide-react'

const BlogCard = ({ post, featured = false, delay = 0 }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10)
  const [shares, setShares] = useState(Math.floor(Math.random() * 20) + 5)

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100
      }
    }
  }

  const imageVariants = {
    hover: { 
      scale: 1.1,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  }

  const contentVariants = {
    hover: { y: -4 }
  }

  const sparkleVariants = {
    hidden: { scale: 0, rotate: 0 },
    visible: { 
      scale: 1, 
      rotate: 360,
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  }

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleBookmark = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShares(shares + 1)
    // Add share functionality here
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: `/blog/${post.id}`
      })
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      academics: 'from-blue-500 to-indigo-600',
      lifestyle: 'from-pink-500 to-rose-600',
      career: 'from-purple-500 to-violet-600',
      wellness: 'from-green-500 to-emerald-600',
      technology: 'from-cyan-500 to-blue-600',
      leadership: 'from-orange-500 to-amber-600'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  const getCategoryEmoji = (category) => {
    const emojis = {
      academics: '📚',
      lifestyle: '✨',
      career: '🚀',
      wellness: '💚',
      technology: '💻',
      leadership: '👑'
    }
    return emojis[category] || '📖'
  }

  return (
    <Link to={`/blog/${post.id}`} className="block">
      <motion.article
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer relative ${
          featured ? 'md:col-span-1 ring-2 ring-blue-100' : ''
        }`}
        style={{
          background: isHovered ? 'linear-gradient(145deg, #ffffff, #f8fafc)' : '#ffffff'
        }}
      >
        {/* Trending/Featured Badge */}
        {(featured || post.views > 1000) && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-4 right-4 z-10"
          >
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold text-white ${
              featured ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-red-500 to-pink-600'
            }`}>
              {featured ? <Sparkles className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              <span>{featured ? 'Featured' : 'Trending'}</span>
            </div>
          </motion.div>
        )}

        {/* Image Container */}
        <div className="relative overflow-hidden">
          <motion.div
            variants={imageVariants}
            className={`aspect-[16/10] bg-gradient-to-br ${getCategoryColor(post.category)} flex items-center justify-center relative`}
          >
            {/* Animated Background Pattern */}
            <motion.div
              animate={{ 
                rotate: isHovered ? 360 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 2, repeat: isHovered ? Infinity : 0, ease: "linear" }}
              className="absolute inset-0 opacity-20"
            >
              <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3)_0%,transparent_70%)]" />
            </motion.div>
            
            <motion.div
              className="relative z-10 text-white flex flex-col items-center space-y-2"
              animate={{ y: isHovered ? -5 : 0 }}
            >
              <motion.div
                className="text-4xl"
                animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
                transition={{ duration: 0.5 }}
              >
                {getCategoryEmoji(post.category)}
              </motion.div>
              <BookOpen className="h-8 w-8" />
            </motion.div>

            {/* Floating Elements */}
            <AnimatePresence>
              {isHovered && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20, x: Math.random() * 100 }}
                      animate={{ 
                        opacity: 1, 
                        y: -20, 
                        x: Math.random() * 100,
                        rotate: Math.random() * 360
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${30 + i * 20}%`
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full shadow-lg"
            >
              <span className="text-lg">{getCategoryEmoji(post.category)}</span>
              <span className="text-sm font-bold text-gray-800 capitalize">
                {post.category}
              </span>
            </motion.div>
          </div>

          {/* Views Badge */}
          <div className="absolute bottom-4 right-4">
            <motion.div 
              className="flex items-center space-x-1 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-sm rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Eye className="h-3 w-3" />
              <span className="font-medium">{post.views.toLocaleString()}</span>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <motion.div variants={contentVariants} className="p-6">
          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
            <motion.div
              className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold"
              animate={{ rotate: isHovered ? [0, -2, 2, 0] : 0 }}
            >
              <Zap className="h-3 w-3" />
              <span>New</span>
            </motion.div>
          </div>

          {/* Title */}
          <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 ${
            featured ? 'text-xl' : 'text-lg'
          }`}>
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 2).map((tag, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.05, y: -1 }}
                className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded-full font-medium hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 transition-all duration-200 cursor-pointer"
              >
                #{tag}
              </motion.span>
            ))}
          </div>

          {/* Author and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <User className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                <p className="text-xs text-gray-500">{post.authorRole}</p>
              </div>
            </div>
            
            {/* Interaction Buttons */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isLiked ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-500'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBookmark}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
              >
                <Share2 className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 15) + 3}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Share2 className="h-4 w-4" />
                <span>{shares}</span>
              </div>
            </div>
            
            <motion.div 
              className="flex items-center space-x-2 text-blue-600 font-semibold text-sm group-hover:space-x-3 transition-all duration-200"
              whileHover={{ x: 5 }}
            >
              <span>Read More</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.div>
          </div>
        </motion.div>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          style={{
            background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
            boxShadow: isHovered ? '0 0 40px rgba(59, 130, 246, 0.3)' : 'none'
          }}
        />
      </motion.article>
    </Link>
  )
}

export default BlogCard