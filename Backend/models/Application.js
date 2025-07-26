const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'shortlisted', 'rejected'], default: 'pending' },
    resume: { type: String, required: true }
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
