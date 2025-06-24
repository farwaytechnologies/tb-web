import React, { useState } from 'react';
import '../Styles/PagesStyle/Login.css';

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState('student');

  const toggleForm = () => setIsSignup(!isSignup);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>

        <form className="auth-form">
          {isSignup && (
            <>
              <div className="auth-field">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>

              <div className="auth-field">
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="auth-select" required>
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="auth-field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" required />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="auth-button">
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p className="auth-toggle">
          {isSignup ? 'Already have an account?' : 'Don’t have an account?'}{' '}
          <span onClick={toggleForm}>
            {isSignup ? 'Log In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
