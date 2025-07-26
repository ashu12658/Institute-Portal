
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Job Status Enum
const jobStatusEnum = ['active', 'upcoming', 'completed', 'rejected'];

const studentSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        course:{type:String,required:true},// course field added here
        batch:{type:String},  // batch field added here
        // Job Application Status Tracking
        // appliedJobs: [
        //     {
        //         jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        //         appliedAt: { type: Date, default: Date.now },
        //         status: { type: String, enum: ['pending', 'shortlisted', 'rejected'], default: 'pending' },
        //     },
        // ],
        // rejectedJobs: [
        //     {
        //         jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        //         rejectedAt: { type: Date, default: Date.now },
        //     },
        // ],
        // shortlistedJobs: [
        //     {
        //         jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        //         shortlistedAt: { type: Date, default: Date.now },
        //     },
        // ],
        skills: {
            type: [String], // Array of skill strings
            default: []
          },

        // Additional Fields
        course: { type: String, required: true }, // The course field to track student’s course
        joiningDate: { type: Date, default: Date.now }, // Joining date of the student

        // Job Status to track whether the job is active, upcoming, or completed
        jobStatus: { type: String, enum: jobStatusEnum, default: 'upcoming' },
    },
    { timestamps: true }
);

// Hashing the password before saving
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Matching the password during login
studentSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


studentSchema.statics.getJobCounts = function (studentId) {
    return this.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(studentId) } },

        {
            $lookup: {
                from: 'jobs',
                localField: 'appliedJobs.jobId',
                foreignField: '_id',
                as: 'appliedJobsInfo'
            }
        },
        {
            $lookup: {
                from: 'jobs',
                localField: 'rejectedJobs.jobId',
                foreignField: '_id',
                as: 'rejectedJobsInfo'
            }
        },
        {
            $lookup: {
                from: 'jobs',
                localField: 'shortlistedJobs.jobId',
                foreignField: '_id',
                as: 'shortlistedJobsInfo'
            }
        },

        {
            $project: {
                name: 1,
                email: 1,
                course: 1,
                joiningDate: 1,
                jobStatus: 1,
                appliedJobsCount: { $size: '$appliedJobs' },
                rejectedJobsCount: { $size: '$rejectedJobs' },
                shortlistedJobsCount: { $size: '$shortlistedJobs' },
                appliedJobsInfo: {
                    $map: {
                        input: "$appliedJobsInfo",
                        as: "job",
                        in: {
                            _id: "$$job._id",
                            companyName: "$$job.companyName",
                            role: "$$job.role",
                            location: "$$job.location",
                            joiningFee: "$$job.joiningFee",
                            applicationStatus: { $literal: "applied" }
                        }
                    }
                },
                rejectedJobsInfo: {
                    $map: {
                        input: "$rejectedJobsInfo",
                        as: "job",
                        in: {
                            _id: "$$job._id",
                            companyName: "$$job.companyName",
                            role: "$$job.role",
                            location: "$$job.location",
                            joiningFee: "$$job.joiningFee",
                            applicationStatus: { $literal: "rejected" }
                        }
                    }
                },
                shortlistedJobsInfo: {
                    $map: {
                        input: "$shortlistedJobsInfo",
                        as: "job",
                        in: {
                            _id: "$$job._id",
                            companyName: "$$job.companyName",
                            role: "$$job.role",
                            location: "$$job.location",
                            joiningFee: "$$job.joiningFee",
                            applicationStatus: { $literal: "shortlisted" }
                        }
                    }
                }
            }
        }
    ]);
};
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
