// import React, { useState } from 'react';
// import { useAuth } from '../context/studentAuthContext';
// import axios from 'axios';

// const AdminTPOLoginPage = () => {
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/users/login', {
//         email,
//         password,
//       });

//       const { token, user } = response.data;

//       if (user.role.toLowerCase() === 'admin') {
//         login(token);
//         sessionStorage.setItem('role', user.role.toLowerCase());
//         window.location.href = '/admin-dashboard';
//       } else if (user.role.toLowerCase() === 'tpo') {
//         login(token);
//         sessionStorage.setItem('role', user.role.toLowerCase());
//         window.location.href = '/tpo-dashboard';
//       } else {
//         setError('Access denied. Only Admins and TPOs can log in here.');
//       }
//     } catch (err) {
//       setError('Login failed. Please check your credentials.');
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>Admin/TPO Login</h2>
//       <form onSubmit={handleLogin} style={styles.form}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           style={styles.input}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           style={styles.input}
//         />
//         <button type="submit" style={styles.button}>Login</button>
//       </form>
//       {error && <p style={styles.error}>{error}</p>}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '100vh',
//     backgroundColor: '#f5f5f5',
//   },
//   heading: {
//     fontSize: '2rem',
//     color: '#333',
//     marginBottom: '20px',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     width: '300px',
//     backgroundColor: '#fff',
//     padding: '20px',
//     borderRadius: '8px',
//     boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//   },
//   input: {
//     padding: '10px',
//     margin: '10px 0',
//     border: '1px solid #ccc',
//     borderRadius: '4px',
//     fontSize: '1rem',
//   },
//   button: {
//     padding: '10px',
//     backgroundColor: '#4CAF50',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     fontSize: '1rem',
//     transition: 'background-color 0.3s',
//   },
//   error: {
//     color: 'red',
//     fontSize: '0.9rem',
//     marginTop: '10px',
//   },
// };

// export default AdminTPOLoginPage;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/studentAuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminTPOLoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  const messages = [
    "Empowering education through technology",
    "Shaping the future of student careers",
    "Your dedication transforms student lives",
    "Building bridges between students and opportunities",
    "Every login makes a difference in education",
    "Guiding students to their dream careers",
    "The backbone of academic success",
    "Where administration meets innovation"
  ];

  useEffect(() => {
    // Set a random motivational message on component mount
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMotivationalMessage(randomMessage);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      if (user.role.toLowerCase() === 'admin') {
        login(token);
        sessionStorage.setItem('role', user.role.toLowerCase());
        window.location.href = '/admin-dashboard';
      } else if (user.role.toLowerCase() === 'tpo') {
        login(token);
        sessionStorage.setItem('role', user.role.toLowerCase());
        window.location.href = '/tpo-dashboard';
      } else {
        setError('Access restricted to authorized personnel only');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
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
      {/* Left side - Decorative */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            textAlign: 'center'
          }}
        >
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Campus Placement Portal
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            maxWidth: '500px',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            {motivationalMessage}
          </p>
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

      {/* Right side - Login Form */}
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
              Admin/TPO Portal
            </h2>
            <p style={{
              color: '#6c757d',
              fontSize: '1rem'
            }}>
              Sign in to manage the placement portal
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
                placeholder="your@email.com"
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
                backgroundColor: '#4e73df',
                backgroundImage: 'linear-gradient(180deg, #4e73df 10%, #224abe 100%)',
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
                  <span style={{ marginRight: '8px' }}>🔒</span>
                  Authenticating...
                </>
              ) : (
                <>
                  <span style={{ marginRight: '8px' }}>🔑</span>
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
              <p>For authorized personnel only</p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminTPOLoginPage;