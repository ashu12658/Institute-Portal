
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode'; // Import jwtDecode to decode the token

// const StudentLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();


//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       // Make login API request
//       const res = await axios.post('http://localhost:5000/api/students/login', {
//         email,
//         password,
//       });
  
//       // Debugging: Check the response and token
//       console.log('Response received:', res);
      
//       const token = res.data.token; // Ensure we are getting token
//       if (!token) {
//         setError('No token received');
//         console.error('No token received!');
//         return;
//       }
  
//       // Decode the token to get the student ID
//       const decoded = jwtDecode(token);
//       console.log('Decoded token:', decoded); // Debugging: Check the decoded token
  
//       const studentId = decoded.id;
//       if (!studentId) {
//         setError('Student ID missing in decoded token');
//         console.error('Student ID missing!');
//         return;
//       }
  
//       // Store both the token and the student ID in sessionStorage
//       sessionStorage.setItem('token', token); 
//       sessionStorage.setItem('studentId', studentId); // Store student ID
  
//       // Debugging: Check if values are stored
//       console.log('Stored in sessionStorage:', {
//         token: sessionStorage.getItem('token'),
//         studentId: sessionStorage.getItem('studentId'),
//       });
  
//       alert('Login successful!');
//       navigate('/student/dashboard'); // Navigate to student dashboard
//     } catch (err) {
//       console.error('Error during login:', err); // Debugging error
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <form onSubmit={handleLogin} style={styles.form}>
//         <h2 style={styles.title}>Student Login</h2>
//         {error && <p style={styles.error}>{error}</p>}
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           style={styles.input}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           style={styles.input}
//           required
//         />
//         <button type="submit" style={styles.button}>Login</button>
//       </form>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     background: '#f5faff',
//     height: '100vh',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   form: {
//     background: '#fff',
//     padding: '40px',
//     borderRadius: '12px',
//     boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//     display: 'flex',
//     flexDirection: 'column',
//     width: '300px',
//   },
//   title: {
//     marginBottom: '20px',
//     textAlign: 'center',
//     color: '#333',
//   },
//   input: {
//     padding: '10px',
//     marginBottom: '15px',
//     borderRadius: '8px',
//     border: '1px solid #ccc',
//     fontSize: '16px',
//   },
//   button: {
//     padding: '10px',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     fontWeight: 'bold',
//     border: 'none',
//     borderRadius: '8px',
//     cursor: 'pointer',
//   },
//   error: {
//     color: 'red',
//     marginBottom: '10px',
//     fontSize: '14px',
//     textAlign: 'center',
//   },
// };

// export default StudentLogin;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const navigate = useNavigate();

  const motivationalMessages = [
    "Unlock your career potential",
    "Your dream job starts here",
    "Bridge to your future career",
    "Empowering student success",
    "Connecting talent with opportunity",
    "Step closer to your goals",
    "Where education meets employment",
    "Launchpad for your career"
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/students/login', {
        email,
        password,
      });
      
      const token = res.data.token;
      if (!token) {
        setError('No token received');
        return;
      }

      const decoded = jwtDecode(token);
      const studentId = decoded.id;
      if (!studentId) {
        setError('Student ID missing in token');
        return;
      }

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('studentId', studentId);

      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
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
        background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
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

      {/* Right login form */}
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
            maxWidth: '400px'
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
              Student Login
            </h2>
            <p style={{
              color: '#6c757d',
              fontSize: '1rem'
            }}>
              Sign in to access your placement portal
            </p>
          </div>

          <form onSubmit={handleLogin} style={{
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
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div style={{ marginBottom: '2rem' }}>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                backgroundColor: '#4b6cb7',
                backgroundImage: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
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
                  Signing In...
                </>
              ) : (
                <>
                  <span style={{ marginRight: '8px' }}>🎓</span>
                  Sign In
                </>
              )}
            </motion.button>

            <div style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: '#6c757d'
            }}>
              <p>New student? Contact your placement cell for access</p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentLogin;