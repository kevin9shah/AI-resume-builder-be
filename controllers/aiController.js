import ai from "../configs/ai";
import Resume from "../models/Resume";

// controller for enhancing a resume's professional summary
// POST : /api/ai/enhance-pro-sum


export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ error: "userContent is missing" });
        }
        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system", content: "You are a helpful assistant for enhancing resume professional summaries. You take the user's input and enhance it to make it more impactful and professional, while keeping the original meaning intact.The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives.Make it compelling and Make it ATS friendly and only return text no options or anything else"
                },
                {
                    role: "user", content: userContent
                }
            ],
        })
        const enhancedContent = response.choices[0].message.content.trim();
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return res.status(400).json({ error: error.message });

    }
}


// controller for enhancing a resume's job description
// POST : /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ error: "userContent is missing" });
        }
        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system", content: "You are a helpful assistant for enhancing resume job descriptions. You take the user's input and enhance it to make it more impactful and professional, while keeping the original meaning intact. The enhanced job description should highlight key responsibilities, achievements, and skills in a compelling way. Make it ATS friendly and only return text no options or anything else"
                },
                {
                    role: "user", content: userContent
                }
            ],
        })
        const enhancedContent = response.choices[0].message.content.trim();
        return res.status(200).json({ enhancedContent });
    } catch (error) {
        return res.status(400).json({ error: error.message });

    }
}

// controller for uploading a resume to the database
// POST : /api/ai/upload-resume

export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;



        if (!resumeText) {
            return res.status(400).json({ error: "resumeText is missing" });
        }

        const systemPrompt = "You are a helpful assistant for uploading resumes. You take the user's input and extract key information such as name, contact details, skills, experience, and education. You then format this information in a structured way that can be easily stored in a database. Only return the extracted information in JSON format without any additional text or explanations."

        const userPrompt = `Here is the resume text:\n\n${resumeText}\n\nPlease extract the following information:\n- Name\n- Contact Details (email, phone number)\n- Skills\n- Experience (job titles, companies, durations)\n- Education (degrees, institutions, graduation years)`

        const response = await ai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system", content: systemPrompt
                },
                {
                    role: "user", content: userPrompt
                }
            ],
            response_format: { type: "json_object" }
        })

        const extractedData = response.choices[0].message.content();
        const parsedData = JSON.parse(extractedData);
        const newResume = await Resume.create({
            userId, title, ...parsedData
        })

        return res.status(200).json({ resumeId: newResume._id });
    } catch (error) {
        return res.status(400).json({ error: error.message });

    }
}   
