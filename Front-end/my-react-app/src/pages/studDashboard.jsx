
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const StudentDashboard = () => {
//   const [studentInfo, setStudentInfo] = useState(null);
//   const [error, setError] = useState(null);
//   const [jobs, setJobs] = useState([]);
//   const [applications, setApplications] = useState([]);
//   const [selectedResume, setSelectedResume] = useState(null);

//   const token = sessionStorage.getItem('token');
//   const studentId = sessionStorage.getItem('studentId');

//   useEffect(() => {
//     if (studentId && token) {
//       fetchStudentInfo();
//       fetchJobs();
//       fetchApplications();
//     } else {
//       setError('No student data found in sessionStorage');
//     }
//   }, []);

//   const fetchStudentInfo = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/students/${studentId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStudentInfo(res.data);
//     } catch (err) {
//       setError('Failed to fetch student information');
//     }
//   };

//   const fetchJobs = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/jobs`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setJobs(res.data);
//     } catch (err) {
//       console.error('Failed to fetch jobs');
//     }
//   };

//   const fetchApplications = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/applications/my-applications`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setApplications(res.data);
//     } catch (err) {
//       console.error('Failed to fetch applications');
//     }
//   };

//   const handleChange = (e) => {
//     setStudentInfo({ ...studentInfo, [e.target.name]: e.target.value });
//   };

//   const handleProfileUpdate = async () => {
//     try {
//       await axios.put(`http://localhost:5000/api/students/update/${studentId}`, studentInfo, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert('Profile updated successfully!');
//     } catch (err) {
//       alert('Failed to update profile');
//     }
//   };

//   const applyToJob = async (jobId) => {
//     if (!studentId || !selectedResume) {
//       alert("Student ID or resume is missing");
//       return;
//     }
  
//     try {
//       const formData = new FormData();
//       formData.append('studentId', sessionStorage.getItem('studentId')); // Get studentId from sessionStorage
//       formData.append('jobId', jobId);
//       formData.append('resume', selectedResume);
  
//       await axios.post(`http://localhost:5000/api/applications/apply`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
  
//       alert('Application submitted successfully!');
//       fetchApplications();
  
//     } catch (err) {
//       console.error('Error applying to job:', err);
  
//       if (err.response) {
//         // Backend responded with a status code outside 2xx
//         const msg = err.response.data?.message;
  
//         if (msg === 'Student has already applied for this job') {
//           alert('You have already applied for this job.');
//         } else {
//           alert(`Server error: ${msg || 'An unexpected error occurred'}`);
//         }
  
//       } else if (err.request) {
//         // Request was made but no response received
//         alert('No response from server. Please check your network connection.');
//       } else {
//         // Other errors (like setting up the request)
//         alert(`Error: ${err.message}`);
//       }
//     }
//   };

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h1 style={{ textAlign: 'center', color: '#4CAF50' }}>Student Dashboard</h1>
//       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

//       {studentInfo ? (
//         <>
//           <div style={{ textAlign: 'center', marginBottom: '20px' }}>
//             <h3 style={{ color: '#4CAF50' }}>Welcome, {studentInfo.name}</h3>
//             <p><strong>Email:</strong> {studentInfo.email}</p>
//             <p><strong>Course:</strong> {studentInfo.course}</p>
//             <p><strong>Batch:</strong> {studentInfo.batch}</p>
//             <p><strong>Job Status:</strong> {studentInfo.jobStatus}</p>
//             <p><strong>Joined on:</strong> {new Date(studentInfo.joiningDate).toLocaleDateString()}</p>
//           </div>

//           <hr style={{ margin: '20px 0' }} />

//           <h2 style={{ textAlign: 'center' }}>Update Profile</h2>
//           <div style={{ maxWidth: '400px', margin: 'auto' }}>
//             <input style={inputStyle} name="name" value={studentInfo.name} onChange={handleChange} placeholder="Name" />
//             <input style={inputStyle} name="email" value={studentInfo.email} onChange={handleChange} placeholder="Email" />
//             <input style={inputStyle} name="course" value={studentInfo.course} onChange={handleChange} placeholder="Course" />
//             <input style={inputStyle} name="batch" value={studentInfo.batch} onChange={handleChange} placeholder="Batch" />
//             <button style={buttonStyle} onClick={handleProfileUpdate}>Update Profile</button>
//           </div>

//           <hr style={{ margin: '20px 0' }} />

//           <h2 style={{ textAlign: 'center' }}>Available Jobs</h2>
//           {jobs.length > 0 ? (
//             jobs.map((job) => (
//               <div key={job._id} style={jobCardStyle}>
//                 <p><strong>Company:</strong> {job.companyName}</p>
//                 <p><strong>Salary:</strong> {job.salary}</p>
//                 <p><strong>Location:</strong> {job.location}</p>
//                 <p><strong>Required skills:</strong> {job.requirements}</p>
//                 <input type="file" onChange={(e) => setSelectedResume(e.target.files[0])} />
//                 <button onClick={() => applyToJob(job._id)}>Apply</button>
//               </div>
//             ))
//           ) : (
//             <p style={{ textAlign: 'center' }}>No jobs available</p>
//           )}

//           <hr style={{ margin: '20px 0' }} />

//           <h2 style={{ textAlign: 'center' }}>My Applications</h2>
//           {applications.length > 0 ? (
//             applications.map((app) => (
//               <div key={app._id} style={jobCardStyle}>
//                 <p><strong>Company:</strong> {app.jobId.companyName}</p>
//                 <p><strong>Salary:</strong> {app.jobId.salary}</p>
//                 <p><strong>Location:</strong> {app.jobId.location}</p>
//                 <p><strong>Status:</strong> <span style={{ color: getStatusColor(app.status) }}>{app.status}</span></p>
//                 <a href={app.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
//               </div>
//             ))
//           ) : (
//             <p style={{ textAlign: 'center' }}>No applications submitted</p>
//           )}
//         </>
//       ) : (
//         <p style={{ textAlign: 'center' }}>Loading student info...</p>
//       )}
//     </div>
//   );
// };

// // Helper function
// const getStatusColor = (status) => {
//   switch (status) {
//     case 'Approved': return 'green';
//     case 'Pending': return 'orange';
//     case 'Rejected': return 'red';
//     default: return 'black';
//   }
// };

// // Styles
// const inputStyle = {
//   width: '100%',
//   padding: '10px',
//   marginBottom: '10px',
//   borderRadius: '5px',
//   border: '1px solid #ccc',
//   fontSize: '16px',
// };

// const buttonStyle = {
//   backgroundColor: '#4CAF50',
//   color: 'white',
//   padding: '10px 20px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
//   fontSize: '16px',
//   width: '100%',
// };

// const jobCardStyle = {
//   border: '1px solid #ddd',
//   padding: '15px',
//   marginBottom: '15px',
//   borderRadius: '8px',
//   backgroundColor: '#f9f9f9',
//   boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
// };

// export default StudentDashboard;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const StudentDashboard = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState({
    profile: false,
    jobs: false,
    applications: false
  });

  const token = sessionStorage.getItem('token');
  const studentId = sessionStorage.getItem('studentId');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      transition: { duration: 0.3 }
    }
  };

  useEffect(() => {
    if (studentId && token) {
      fetchStudentInfo();
      fetchJobs();
      fetchApplications();
    } else {
      setError('No student data found in sessionStorage');
    }
  }, []);

  const fetchStudentInfo = async () => {
    setLoading(prev => ({ ...prev, profile: true }));
    try {
      const res = await axios.get(`http://localhost:5000/api/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentInfo(res.data);
    } catch (err) {
      setError('Failed to fetch student information');
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const fetchJobs = async () => {
    setLoading(prev => ({ ...prev, jobs: true }));
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs');
    } finally {
      setLoading(prev => ({ ...prev, jobs: false }));
    }
  };

  const fetchApplications = async () => {
    setLoading(prev => ({ ...prev, applications: true }));
    try {
      const res = await axios.get(`http://localhost:5000/api/applications/my-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications');
    } finally {
      setLoading(prev => ({ ...prev, applications: false }));
    }
  };

  const handleChange = (e) => {
    setStudentInfo({ ...studentInfo, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/students/update/${studentId}`, studentInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const applyToJob = async (jobId) => {
    if (!studentId || !selectedResume) {
      alert("Student ID or resume is missing");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('studentId', sessionStorage.getItem('studentId'));
      formData.append('jobId', jobId);
      formData.append('resume', selectedResume);
  
      await axios.post(`http://localhost:5000/api/applications/apply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      alert('Application submitted successfully!');
      fetchApplications();
  
    } catch (err) {
      console.error('Error applying to job:', err);
  
      if (err.response) {
        const msg = err.response.data?.message;
  
        if (msg === 'Student has already applied for this job') {
          alert('You have already applied for this job.');
        } else {
          alert(`Server error: ${msg || 'An unexpected error occurred'}`);
        }
  
      } else if (err.request) {
        alert('No response from server. Please check your network connection.');
      } else {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return '#4CAF50';
      case 'Pending': return '#FFA500';
      case 'Rejected': return '#F44336';
      default: return '#607D8B';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '40px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '25px 30px',
          textAlign: 'center'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>Student Dashboard</h1>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: '#FFEBEE',
                color: '#D32F2F',
                padding: '10px',
                borderRadius: '8px',
                marginTop: '15px',
                display: 'inline-block'
              }}
            >
              {error}
            </motion.div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ padding: '30px' }}>
          {studentInfo ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Student Profile */}
              <motion.div variants={itemVariants}>
                <div style={{
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
                  padding: '20px',
                  borderRadius: '10px',
                  marginBottom: '30px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '15px'
                }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Name</p>
                    <p style={{ margin: 0, fontWeight: '600' }}>{studentInfo.name}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Email</p>
                    <p style={{ margin: 0, fontWeight: '600' }}>{studentInfo.email}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Course</p>
                    <p style={{ margin: 0, fontWeight: '600' }}>{studentInfo.course}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Batch</p>
                    <p style={{ margin: 0, fontWeight: '600' }}>{studentInfo.batch}</p>
                  </div>
                </div>
              </motion.div>

              {/* Profile Update Form */}
              <motion.div variants={itemVariants} style={{ marginBottom: '30px' }}>
                <h2 style={{
                  fontSize: '22px',
                  fontWeight: '600',
                  marginBottom: '20px',
                  color: '#444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{
                    width: '8px',
                    height: '25px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '4px'
                  }}></span>
                  Update Profile
                </h2>

                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '25px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '20px'
                  }}>
                    {['name', 'email', 'course', 'batch'].map((field) => (
                      <div key={field}>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontWeight: '500',
                          color: '#555'
                        }}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                          type="text"
                          name={field}
                          value={studentInfo[field] || ''}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px 15px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '16px',
                            backgroundColor: '#f9f9f9'
                          }}
                          placeholder={`Enter ${field}`}
                        />
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleProfileUpdate}
                    style={{
                      padding: '12px 25px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '16px'
                    }}
                  >
                    Update Profile
                  </motion.button>
                </div>
              </motion.div>

              {/* Navigation Tabs */}
              <div style={{
                display: 'flex',
                borderBottom: '1px solid #ddd',
                marginBottom: '20px'
              }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('jobs')}
                  style={{
                    padding: '10px 20px',
                    background: activeTab === 'jobs' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                    color: activeTab === 'jobs' ? 'white' : '#666',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '16px',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px'
                  }}
                >
                  Available Jobs
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('applications')}
                  style={{
                    padding: '10px 20px',
                    background: activeTab === 'applications' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                    color: activeTab === 'applications' ? 'white' : '#666',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '16px',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px'
                  }}
                >
                  My Applications
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'jobs' && (
                  <motion.div
                    key="jobs"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 style={{
                      fontSize: '22px',
                      fontWeight: '600',
                      marginBottom: '20px',
                      color: '#444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span style={{
                        width: '8px',
                        height: '25px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '4px'
                      }}></span>
                      Available Jobs
                    </h2>

                    {loading.jobs ? (
                      <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Loading jobs...</p>
                      </div>
                    ) : jobs.length > 0 ? (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                          gap: '20px'
                        }}
                      >
                        {jobs.map((job) => (
                          <motion.div
                            key={job._id}
                            variants={itemVariants}
                            whileHover="hover"
                            style={{
                              background: 'white',
                              borderRadius: '12px',
                              padding: '20px',
                              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                              border: '1px solid #eee'
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '15px'
                            }}>
                              <h3 style={{
                                margin: 0,
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#333'
                              }}>{job.companyName}</h3>
                              <span style={{
                                padding: '5px 10px',
                                borderRadius: '20px',
                                background: '#E3F2FD',
                                color: '#1976D2',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                {job.status}
                              </span>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                              <p style={{ margin: '5px 0', color: '#666' }}>
                                <span style={{ fontWeight: '500', color: '#444' }}>Role:</span> {job.role}
                              </p>
                              <p style={{ margin: '5px 0', color: '#666' }}>
                                <span style={{ fontWeight: '500', color: '#444' }}>Salary:</span> {job.salary}
                              </p>
                              <p style={{ margin: '5px 0', color: '#666' }}>
                                <span style={{ fontWeight: '500', color: '#444' }}>Location:</span> {job.location}
                              </p>
                              <p style={{ margin: '5px 0', color: '#666' }}>
                                <span style={{ fontWeight: '500', color: '#444' }}>Requirements:</span> {job.requirements.substring(0, 50)}...
                              </p>
                            </div>

                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px'
                            }}>
                              <div>
                                <label style={{
                                  display: 'block',
                                  marginBottom: '8px',
                                  fontWeight: '500',
                                  color: '#555'
                                }}>Upload Resume</label>
                                <input
                                  type="file"
                                  onChange={(e) => setSelectedResume(e.target.files[0])}
                                  style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => applyToJob(job._id)}
                                style={{
                                  padding: '10px 15px',
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontWeight: '500',
                                  fontSize: '14px'
                                }}
                              >
                                Apply for this Job
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          background: 'white',
                          padding: '40px',
                          borderRadius: '12px',
                          textAlign: 'center',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                        }}
                      >
                        <p style={{ color: '#888', fontSize: '16px' }}>
                          No jobs available at the moment. Please check back later.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'applications' && (
                  <motion.div
                    key="applications"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 style={{
                      fontSize: '22px',
                      fontWeight: '600',
                      marginBottom: '20px',
                      color: '#444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span style={{
                        width: '8px',
                        height: '25px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '4px'
                      }}></span>
                      My Applications
                    </h2>

                    {loading.applications ? (
                      <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Loading applications...</p>
                      </div>
                    ) : applications.length > 0 ? (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                          gap: '20px'
                        }}
                      >
                        {applications.map((application) => (
                          <motion.div
                            key={application._id}
                            variants={itemVariants}
                            whileHover="hover"
                            style={{
                              background: 'white',
                              borderRadius: '12px',
                              padding: '20px',
                              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                              border: '1px solid #eee'
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '15px'
                            }}>
                              <h3 style={{
                                margin: 0,
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#333'
                              }}>{application.jobId?.companyName || 'N/A'}</h3>
                              <span style={{
                                padding: '5px 10px',
                                borderRadius: '20px',
                                background: getStatusColor(application.status),
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                {application.status}
                              </span>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                              <p style={{ margin: '5px 0', color: '#666' }}></p>
                              <p style={{ margin: '5px 0', color: '#666' }}>
                                <span style={{ fontWeight: '500', color: '#444' }}>Salary:</span> {application.jobId?.salary || 'N/A'}
                              </p>
                              <p style={{ margin: '5px 0', color: '#666' }}>
                                <span style={{ fontWeight: '500', color: '#444' }}>Location:</span> {application.jobId?.location || 'N/A'}
                              </p>
                              <p style={{ margin: '5px 0', color: '#666' }}>
                                <span style={{ fontWeight: '500', color: '#444' }}>Applied on:</span> {new Date(application.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            {application.resume && (
                              <motion.a
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                href={application.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-block',
                                  padding: '8px 15px',
                                  background: '#E3F2FD',
                                  color: '#1976D2',
                                  borderRadius: '6px',
                                  textDecoration: 'none',
                                  fontWeight: '500',
                                  fontSize: '14px'
                                }}
                              >
                                View Resume
                              </motion.a>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          background: 'white',
                          padding: '40px',
                          borderRadius: '12px',
                          textAlign: 'center',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                        }}
                      >
                        <p style={{ color: '#888', fontSize: '16px' }}>
                          You haven't applied to any jobs yet.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading student information...</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentDashboard;