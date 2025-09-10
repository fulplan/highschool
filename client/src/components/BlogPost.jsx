import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Eye, ArrowLeft, Share2, Heart, Bookmark, Tag } from 'lucide-react'
import { getBlogPostById, getRelatedPosts } from '../data/blogData'

const BlogPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const post = getBlogPostById(id)
  const relatedPosts = getRelatedPosts(id)
  
  // If post not found, show error message
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link 
            to="/blog" 
            className="inline-flex items-center space-x-2 bg-accent text-white px-6 py-3 rounded-full hover:bg-accent/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/blog')}
            className="flex items-center space-x-2 text-gray-600 hover:text-accent mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </motion.button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Category and Meta */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span className="px-3 py-1 bg-accent/10 text-accent font-medium rounded-full">
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </span>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{post.author}</h3>
                  <p className="text-gray-600">{post.authorRole}</p>
                </div>
              </div>

              {/* Social Actions */}
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>{post.shares}</span>
                </button>
                <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.header>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="aspect-[16/9] bg-gradient-to-br from-accent/20 to-accent/40 rounded-2xl flex items-center justify-center">
              {/* Placeholder for actual image */}
              <div className="text-center">
                <Tag className="h-16 w-16 text-accent/60 mx-auto mb-4" />
                <p className="text-accent/60 font-medium">Article Featured Image</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Article Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-accent prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium hover:bg-accent hover:text-white transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-6 bg-gray-100 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Author</h3>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{post.author}</h4>
                    <p className="text-accent font-medium mb-2">{post.authorRole}</p>
                    <p className="text-gray-700 leading-relaxed">{post.authorBio}</p>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-1"
            >
              {/* Table of Contents */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  <a href="#pomodoro" className="block text-gray-600 hover:text-accent transition-colors">1. The Pomodoro Technique</a>
                  <a href="#active-recall" className="block text-gray-600 hover:text-accent transition-colors">2. Active Recall</a>
                  <a href="#spaced-repetition" className="block text-gray-600 hover:text-accent transition-colors">3. Spaced Repetition</a>
                  <a href="#peak-hours" className="block text-gray-600 hover:text-accent transition-colors">4. Find Your Peak Hours</a>
                  <a href="#study-space" className="block text-gray-600 hover:text-accent transition-colors">5. Create a Study Space</a>
                </nav>
              </div>

              {/* Related Posts */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`} className="block group">
                      <div className="aspect-[16/10] bg-accent/20 rounded-lg mb-3 flex items-center justify-center">
                        <Tag className="h-6 w-6 text-accent/60" />
                      </div>
                      <h4 className="font-medium text-gray-900 group-hover:text-accent transition-colors line-clamp-2 mb-1">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-gray-500">{relatedPost.readTime}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPost