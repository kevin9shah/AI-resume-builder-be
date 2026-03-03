import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";
// controller for creating a new resume
// POST : /api/resumes/create


export const createResume = async (req, res) => {
    try {
        const userId = req.userID;
        const title = req.body.title;

        // create new resume
        const newResume = await Resume.create({ userId, title });

        // return success message
        return res.status(201).json({ message: "resume created successfully", resume: newResume })


    } catch (error) {
        return res.status(400).json({ message: "error creating resume", error: error.message })

    }
}


// controller for deleting a resume
// DELETE : /api/resumes/delete/:id

export const deleteResume = async (req, res) => {
    try {
        const userId = req.userID;
        const resumeId = req.params.resumeId;

        // deleting resume
        await Resume.findOneAndDelete({ userId, _id: resumeId })


        // return success message
        return res.status(200).json({ message: "resume deleted successfully" })


    } catch (error) {
        return res.status(400).json({ message: "error deleting resume", error: error.message })

    }
}


// GET : /api/resumes/:id

export const getResumeById = async (req, res) => {
    try {
        const userId = req.userID;
        const resumeId = req.params.resumeId;

        const resume = await Resume.findOne({ userId, _id: resumeId })

        if (!resume) {
            return res.status(404).json({ message: "resume not found" })
        }

        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        // return success message
        return res.status(200).json({ message: "resume retrieved successfully", resume: resume })


    } catch (error) {
        return res.status(400).json({ message: "error retrieving resume", error: error.message })

    }
}

// get resume by id public
// GET : /api/resumes/public

export const getPublicResumeById = async (req, res) => {
    try {
        const resumeId = req.params.resumeId;

        const resume = await Resume.findOne({ public: true, _id: resumeId })
        if (!resume) {
            return res.status(404).json({ message: "resume not found" })
        }

        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        // return success message
        return res.status(200).json({ message: "resume retrieved successfully", resume: resume })
    } catch (error) {
        return res.status(400).json({ message: "error retrieving resume", error: error.message })
    }
}


// update resume by id
// PUT : /api/resumes/update

export const updateResume = async (req, res) => {
    try {
        const userId = req.userID;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        if (!resumeId || !resumeData) {
            return res.status(400).json({ message: "resumeId and resumeData are required" });
        }

        let resumeDataCopy;

        if (typeof resumeData === 'string') {
            resumeDataCopy = JSON.parse(resumeData)
        }
        else {
            resumeDataCopy = structuredClone(resumeData)
        }

        // Prevent immutable/internal fields from being updated.
        delete resumeDataCopy._id;
        delete resumeDataCopy.userId;
        delete resumeDataCopy.__v;
        delete resumeDataCopy.createdAt;
        delete resumeDataCopy.updatedAt;

        if (image) {

            const imageBufferData = fs.createReadStream(image.path);


            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation: {
                    pre: 'w-300 , h-300, fo-face, z-0.75' + (removeBackground ? ',e-bg_remove' : ' ')
                }
            });
            if (!resumeDataCopy.personal_info) {
                resumeDataCopy.personal_info = {};
            }
            resumeDataCopy.personal_info.image = response.url;
        }

        const resume = await Resume.findOneAndUpdate({ userId, _id: resumeId }, resumeDataCopy, { new: true })

        if (!resume) {
            return res.status(404).json({ message: "resume not found" });
        }

        return res.status(200).json({ message: "resume updated successfully", resume })

    } catch (error) {
        return res.status(400).json({ message: "error updating resume", error: error.message })
    }

}
