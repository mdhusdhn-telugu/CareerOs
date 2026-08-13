import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from './blogData';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Scene from '../Homepage/Scene';
import './BlogPostPage.css';

const BlogPostPage = () => {
  const { postId } = useParams();
  const post = blogPosts.find(p => p.id == postId);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return (
      <>
        <Scene />
        <div className="page-wrapper">
          <Navbar />
          <div className="blog-not-found">
            <h1>404: Signal Lost</h1>
            <Link to="/blog" className="back-link">Return to Feed</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Scene />
      <div className="page-wrapper">
        <Navbar />
        
        <article className="post-container">
          <Link to="/blog" className="back-nav">
            <span className="arrow">←</span> Intel Feed
          </Link>

          <motion.header 
            className="post-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="post-tags">
              {post.tags.map(tag => <span key={tag}>#{tag}</span>)}
            </div>
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <span className="author">By {post.author}</span>
              <span className="dot">•</span>
              <span className="date">{post.date}</span>
            </div>
          </motion.header>

          <motion.div 
            className="post-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* NOTE: Since your data has Markdown-like syntax (###, **), 
              in a real app you'd use 'react-markdown'. 
              For now, I'm wrapping it in white-space-pre-line to respect line breaks.
            */}
            <div className="content-body" style={{ whiteSpace: 'pre-line' }}>
              {post.content}
            </div>
          </motion.div>

        </article>
        
        <Footer />
      </div>
    </>
  );
};

export default BlogPostPage;