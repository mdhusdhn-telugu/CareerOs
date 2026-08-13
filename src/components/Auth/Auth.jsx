import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';

// Icons
import { FaUser, FaLock, FaEnvelope, FaGoogle, FaGithub, FaTwitter } from 'react-icons/fa';
import "./Auth.css";

const Auth = () => {
  // State: 'login', 'signup', or 'reset'
  const [view, setView] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  // Helper to clear forms when switching views
  const switchView = (newView) => {
    setError('');
    setMessage('');
    setView(newView);
  };

  const handleAuthError = (err) => {
    console.error(err);
    let msg = 'Something went wrong. Please try again.';
    if (err.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
    if (err.code === 'auth/user-not-found') msg = 'No account found with this email.';
    if (err.code === 'auth/wrong-password') msg = 'Incorrect password.';
    if (err.code === 'auth/email-already-in-use') msg = 'Email is already registered.';
    if (err.code === 'auth/weak-password') msg = 'Password must be at least 6 characters.';
    setError(msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (view === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/profile');
      } 
      else if (view === 'signup') {
        if (password !== confirmPassword) throw { code: 'custom/mismatch' };
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setMessage('Account created! Verification email sent.');
        // Optional: Redirect after delay or let them check email
        setTimeout(() => navigate('/profile'), 3000);
      } 
      else if (view === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setMessage('Reset link sent to your email.');
        setTimeout(() => switchView('login'), 3000);
      }
    } catch (err) {
      if (err.code === 'custom/mismatch') setError('Passwords do not match.');
      else handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/profile');
    } catch (err) {
      handleAuthError(err);
    }
  };

  // Render Form Content based on View
  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Header Section */}
        <div className="auth-header">
          <h1>
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Join CodeAstra'}
            {view === 'reset' && 'Reset Password'}
          </h1>
          <p>
            {view === 'login' && 'Enter your credentials to access your account.'}
            {view === 'signup' && 'Start your journey to a dream career today.'}
            {view === 'reset' && 'We’ll send you a link to reset your password.'}
          </p>
        </div>

        {/* Alerts */}
        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* Email Field (Used in all views) */}
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <FaEnvelope className="input-icon" />
          </div>

          {/* Password Fields (Hidden in Reset view) */}
          {view !== 'reset' && (
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <FaLock className="input-icon" />
            </div>
          )}

          {view === 'signup' && (
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
              <FaLock className="input-icon" />
            </div>
          )}

          {/* Forgot Password Link */}
          {view === 'login' && (
            <span onClick={() => switchView('reset')} className="forgot-password">
              Forgot Password?
            </span>
          )}

          {/* Submit Button */}
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Processing...' : (
              view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Send Link'
            )}
          </button>
        </form>

        {/* Social Login (Only for Login/Signup) */}
        {view !== 'reset' && (
          <>
            <div className="divider"><span>Or continue with</span></div>
            <div className="social-login">
              <button type="button" className="social-btn" onClick={handleGoogleLogin}><FaGoogle /></button>
              <button type="button" className="social-btn"><FaGithub /></button>
              <button type="button" className="social-btn"><FaTwitter /></button>
            </div>
          </>
        )}

        {/* Bottom Switcher */}
        <div className="auth-switch">
          {view === 'login' ? (
            <>Don't have an account? <span onClick={() => switchView('signup')} className="highlight-link">Sign Up</span></>
          ) : view === 'signup' ? (
            <>Already have an account? <span onClick={() => switchView('login')} className="highlight-link">Log In</span></>
          ) : (
            <span onClick={() => switchView('login')} className="highlight-link">Back to Login</span>
          )}
        </div>

      </div>
    </div>
  );
};

export default Auth;