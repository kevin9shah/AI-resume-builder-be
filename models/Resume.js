import mongoose from "mongoose";
import { stringify } from "node:querystring";

const resumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, default: "Untitled Resume" },
    public: { type: Boolean, default: false },
    template: { type: String, default: "classic" },
    accentColor: { type: String, default: "#3B82F6" },
    professional_summary: { type: String, default: "" },
    skills: [{ type: String }],
    personal_info: {
        image: { type: String, default: "" },
        full_name: { type: String, default: "" },
        profession: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        website: { type: String, default: "" },

    },
    experience: [
        {
            company: { type: String },
            position: { type: String },
            startDate: { type: Date },
            endDate: { type: Date },
            description: { type: String, default: "" },
            is_current: { type: Boolean, default: false }
        }
    ],
    projects: [
        {
            name: { type: String },
            type: { type: String },
            description: { type: String, default: "" }
        }
    ],
    education: [
        {
            institution: { type: String },
            degree: { type: String },
            field: { type: String },
            graduation_data: { type: Date },
            gpa: { type: String }
        }
    ],


}, { timestamps: true, minimize: false })

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;  
