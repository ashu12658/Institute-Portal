
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const TpoAdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    companyName: '',
    role: '',
    location: '',
    requirements: '',
    status: 'open',
    salary: '',
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeTab, setActiveTab] = useState('applications');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('authToken');
        const res = await axios.get('http://localhost:5000/api/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
      } catch (err) {
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedStudent) return;
      try {
        const token = sessionStorage.getItem('authToken');
        const res = await axios.get('http://localhost:5000/api/applications/student', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch {
        setError('Error fetching applications');
      }
    };
    fetchApplications();
  }, [selectedStudent]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/jobs');
        setJobs(res.data);
      } catch {
        setError('Error fetching jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleStatusChange = async (id) => {
    const newStatus = statusMap[id];
    if (!newStatus) return;
    try {
      const token = sessionStorage.getItem('authToken');
      await axios.put(`http://localhost:5000/api/applications/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications((prev) => prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app)));
    } catch {
      setError('Failed to update status');
    }
  };

  const handleAddJob = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const res = await axios.post('http://localhost:5000/api/jobs/create-job', newJob, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => [...prev, res.data]);
      setNewJob({
        companyName: '',
        role: '',
        location: '',
        requirements: '',
        status: 'open',
        salary: '',
      });
    } catch {
      setError('Failed to add job');
    }
  };

  const handleUpdateJob = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const res = await axios.put(`http://localhost:5000/api/jobs/${selectedJob._id}`, selectedJob, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => prev.map((job) => (job._id === selectedJob._id ? res.data : job)));
      setSelectedJob(null);
    } catch {
      setError('Failed to update job');
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      const token = sessionStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch {
      setError('Failed to delete job');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#FFD700';
      case 'shortlisted': return '#90EE90';
      case 'rejected': return '#FF6347';
      case 'open': return '#ADD8E6';
      case 'closed': return '#D3D3D3';
      default: return '#F0F0F0';
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>TPO Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '8px 20px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '30px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                backdropFilter: 'blur(5px)'
              }}
              onClick={() => setActiveTab('applications')}
            >
              Applications
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '8px 20px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '30px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                backdropFilter: 'blur(5px)'
              }}
              onClick={() => setActiveTab('jobs')}
            >
              Job Management
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '30px' }}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: '#FFEBEE',
                color: '#D32F2F',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Student Selection */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ marginBottom: '30px' }}
          >
            <motion.div variants={itemVariants}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#555'
              }}>Select Student</label>
              <select 
                onChange={(e) => setSelectedStudent(JSON.parse(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  backgroundColor: '#f9f9f9',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  backgroundSize: '12px auto'
                }}
              >
                <option value="">Select a Student</option>
                {students.map((student) => (
                  <option key={student._id} value={JSON.stringify(student)}>
                    {student.firstName} {student.lastName} ({student.email})
                  </option>
                ))}
              </select>
            </motion.div>

            {selectedStudent && (
              <motion.div 
                variants={itemVariants}
                style={{
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
                  padding: '20px',
                  borderRadius: '10px',
                  marginTop: '20px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '15px'
                }}
              > 
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Name</p>
                  <p style={{ margin: 0, fontWeight: '600' }}>
                    {selectedStudent.name}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Email</p>
                  <p style={{ margin: 0, fontWeight: '600' }}>{selectedStudent.email}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Course</p>
                  <p style={{ margin: 0, fontWeight: '600' }}>{selectedStudent.course}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Batch</p>
                  <p style={{ margin: 0, fontWeight: '600' }}>{selectedStudent.batch}</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
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
                  Student Applications
                </h2>

                {applications.length > 0 ? (
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
                          marginBottom: '15px'
                        }}>
                          <h3 style={{
                            margin: 0,
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#333'
                          }}>{application.jobId?.title || 'N/A'}</h3>
                          <span style={{
                            padding: '5px 10px',
                            borderRadius: '20px',
                            background: getStatusColor(application.status),
                            color: '#333',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {application.status}
                          </span>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                          <p style={{ margin: '5px 0', color: '#666' }}>
                            <span style={{ fontWeight: '500', color: '#444' }}>Company:</span> {application.jobId?.companyName || 'N/A'}
                          </p>
                          <p style={{ margin: '5px 0', color: '#666' }}>
                            <span style={{ fontWeight: '500', color: '#444' }}>Location:</span> {application.jobId?.location || 'N/A'}
                          </p>
                          <p style={{ margin: '5px 0', color: '#666' }}>
                            <span style={{ fontWeight: '500', color: '#444' }}>Salary:</span> {application.jobId?.salary || 'N/A'}
                          </p>
                        </div>

                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center'
                        }}>
                          <select
                            value={statusMap[application._id] || application.status}
                            onChange={(e) => setStatusMap({ ...statusMap, [application._id]: e.target.value })}
                            style={{
                              flex: 1,
                              padding: '10px',
                              borderRadius: '6px',
                              border: '1px solid #ddd',
                              background: '#f9f9f9',
                              fontSize: '14px'
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleStatusChange(application._id)}
                            style={{
                              padding: '10px 15px',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '500'
                            }}
                          >
                            Update
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
                      {selectedStudent 
                        ? 'No applications found for this student.' 
                        : 'Please select a student to view applications.'}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'jobs' && (
              <motion.div
                key="jobs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ marginBottom: '30px' }}>
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
                    Add New Job
                  </h2>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '25px',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                      gap: '20px',
                      marginBottom: '20px'
                    }}>
                      {['companyName', 'role', 'location', 'salary'].map((field) => (
                        <motion.div key={field} variants={itemVariants}>
                          <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#555'
                          }}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                          <input
                            type="text"
                            name={field}
                            value={newJob[field]}
                            onChange={(e) => setNewJob({ ...newJob, [field]: e.target.value })}
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
                        </motion.div>
                      ))}
                    </div>

                    <motion.div variants={itemVariants}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        color: '#555'
                      }}>Requirements</label>
                      <textarea
                        name="requirements"
                        value={newJob.requirements}
                        onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          fontSize: '16px',
                          backgroundColor: '#f9f9f9',
                          minHeight: '100px',
                          resize: 'vertical'
                        }}
                        placeholder="Enter job requirements"
                      />
                    </motion.div>

                    <motion.div 
                      variants={itemVariants}
                      style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleAddJob}
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
                        Add Job
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>

                <div>
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
                    Job Listings
                  </h2>

                  {jobs.length > 0 ? (
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
                              background: getStatusColor(job.status),
                              color: '#333',
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
                              <span style={{ fontWeight: '500', color: '#444' }}>Location:</span> {job.location}
                            </p>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                              <span style={{ fontWeight: '500', color: '#444' }}>Salary:</span> {job.salary}
                            </p>
                            <p style={{ margin: '5px 0', color: '#666' }}>
                              <span style={{ fontWeight: '500', color: '#444' }}>Requirements:</span> {job.requirements.substring(0, 50)}...
                            </p>
                          </div>

                          <div style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'flex-end'
                          }}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedJob(job)}
                              style={{
                                padding: '8px 15px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                fontSize: '14px'
                              }}
                            >
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteJob(job._id)}
                              style={{
                                padding: '8px 15px',
                                background: '#FF5252',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                fontSize: '14px'
                              }}
                            >
                              Delete
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
                        No jobs found. Add a new job to get started.
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Job Edit Modal */}
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '30px',
                  width: '90%',
                  maxWidth: '600px',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.2)'
                }}
              >
                <h2 style={{
                  fontSize: '22px',
                  fontWeight: '600',
                  marginBottom: '20px',
                  color: '#444',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  Edit Job
                  <button 
                    onClick={() => setSelectedJob(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '20px',
                      cursor: 'pointer',
                      color: '#888'
                    }}
                  >
                    ×
                  </button>
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  {['companyName', 'role', 'location', 'salary'].map((field) => (
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
                        value={selectedJob[field]}
                        onChange={(e) => setSelectedJob({ ...selectedJob, [field]: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          fontSize: '16px',
                          backgroundColor: '#f9f9f9'
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#555'
                  }}>Requirements</label>
                  <textarea
                    name="requirements"
                    value={selectedJob.requirements}
                    onChange={(e) => setSelectedJob({ ...selectedJob, requirements: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '16px',
                      backgroundColor: '#f9f9f9',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#555'
                  }}>Status</label>
                  <select
                    name="status"
                    value={selectedJob.status}
                    onChange={(e) => setSelectedJob({ ...selectedJob, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '16px',
                      backgroundColor: '#f9f9f9'
                    }}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedJob(null)}
                    style={{
                      padding: '12px 25px',
                      background: '#f0f0f0',
                      color: '#555',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '16px'
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleUpdateJob}
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
                    Update Job
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TpoAdminDashboard;