const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }, // Ensure this is correct
    requirements: { type: String, required: true },
    status: { type: String, enum: ['active', 'upcoming', 'expired'], default: 'upcoming' },
    postedAt: { type: Date, default: Date.now },
    salary: { type: String, required: true },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
