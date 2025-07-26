import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    course: '',
    batch: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const navigate = useNavigate();

  const motivationalMessages = [
    "Start your career journey today",
    "Your future begins with this step",
    "Join the community of achievers",
    "Register to unlock opportunities",
    "First step towards your dream job",
    "Build your professional profile",
    "Connect with top recruiters",
    "Shape your career path"
  ];

  useEffect(() => {
    // Set initial message
    setCurrentMessage(motivationalMessages[0]);
    
    // Rotate messages every 4 seconds
    const interval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = motivationalMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % motivationalMessages.length;
        return motivationalMessages[nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...studentData } = formData;
      
      const response = await axios.post('http://localhost:5000/api/students/register', studentData);
      
      if (response.data.token) {
        // Redirect to login after successful registration
        navigate('/login', { state: { registrationSuccess: true } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Left decorative panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            zIndex: 2,
            textAlign: 'center',
            padding: '0 2rem'
          }}
        >
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            Campus Placement Portal
          </h1>
          
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              maxWidth: '500px',
              lineHeight: '1.6',
              marginBottom: '2rem',
              minHeight: '60px'
            }}
          >
            {currentMessage}
          </motion.p>
        </motion.div>
        
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-80px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)'
        }}></div>
      </div>

      {/* Right registration form */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            width: '100%',
            maxWidth: '450px'
          }}
        >
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#343a40',
              marginBottom: '0.5rem'
            }}>
              Student Registration
            </h2>
            <p style={{
              color: '#6c757d',
              fontSize: '1rem'
            }}>
              Create your account to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  backgroundColor: '#fff3f3',
                  color: '#dc3545',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  borderLeft: '4px solid #dc3545'
                }}
              >
                {error}
              </motion.div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                  outline: 'none'
                }}
                placeholder="John Doe"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                  outline: 'none'
                }}
                placeholder="student@university.edu"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                Course
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                  outline: 'none'
                }}
                placeholder="Computer Science"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                Batch
              </label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                  outline: 'none'
                }}
                placeholder="2023-2027"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                  outline: 'none'
                }}
                placeholder="••••••••"
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                  outline: 'none'
                }}
                placeholder="••••••••"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#3a7bd5',
                backgroundImage: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? (
                <>
                  <span style={{ marginRight: '8px' }}>⏳</span>
                  Registering...
                </>
              ) : (
                <>
                  <span style={{ marginRight: '8px' }}>📝</span>
                  Register Now
                </>
              )}
            </motion.button>

            <div style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: '#6c757d'
            }}>
              <p>Already have an account? <a 
                href="/login" 
                style={{
                  color: '#3a7bd5',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                Sign in here
              </a></p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentRegister;