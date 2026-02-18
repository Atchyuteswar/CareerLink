import { createRequire } from "module"; 
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

// A list of common tech skills to look for
const SKILL_KEYWORDS = [
    // Data Science & ML
    "Data Science", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", 
    "TensorFlow", "PyTorch", "Scikit-Learn", "Pandas", "NumPy", "Matplotlib", 
    "Seaborn", "Power BI", "Tableau", "Keras", "NLTK", "OpenCV",
    
    // Languages & Web
    "Python", "R", "SQL", "Julia", "JavaScript", "React", "Node.js", "FastAPI",
    
    // Tools & Cloud
    "Jupyter", "AWS", "Google Cloud", "Azure", "Docker", "Git", "Spark", "Hadoop"
];

export const extractDataFromResume = async (fileBuffer) => {
    try {
        const data = await pdf(fileBuffer);
        const text = data.text;
        
        // 1. Extract Skills
        // We look for our keywords in the text (case-insensitive)
        const foundSkills = SKILL_KEYWORDS.filter(skill => 
            new RegExp(`\\b${skill}\\b`, 'i').test(text)
        );

        // Remove duplicates
        const uniqueSkills = [...new Set(foundSkills)];

        // 2. Extract Experience (Simple Heuristic)
        // We look for patterns like "2 years", "2020 - 2022", etc.
        let experience = "";
        const expMatch = text.match(/(\d+)\s+(years?|yrs?)/i);
        if(expMatch) {
            experience = `${expMatch[1]} Years`;
        }

        return {
            skills: uniqueSkills,
            bio: `Experienced in ${uniqueSkills.slice(0, 3).join(", ")} and more.` 
        };
    } catch (error) {
        console.error("Resume parsing failed:", error);
        return { skills: [], bio: "" };
    }
};