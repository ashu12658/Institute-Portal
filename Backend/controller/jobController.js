  const Job = require('../models/Job');

  // Get all jobs
  exports.getAllJobs = async (req, res) => {
    try {
      const jobs = await Job.find();
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching jobs', error });
    }
  };

  // Add a new job posting
  exports.addJob = async (req, res) => {
    try {
      const { companyName, role, location, requirements, status, salary } = req.body;
      const newJob = new Job({ companyName, role, location, requirements, salary });
      await newJob.save();
      res.status(201).json(newJob);
    } catch (error) {
      res.status(500).json({ message: 'Error adding job', error });
    }
  };

  // Get job details by ID
  exports.getJobById = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching job', error });
    }
  };

  // Update job details
  exports.updateJob = async (req, res) => {
    try {
      const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ message: 'Error updating job', error });
    }
  };

  // Delete a job posting
  exports.deleteJob = async (req, res) => {
    try {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting job', error });
    }
  };
