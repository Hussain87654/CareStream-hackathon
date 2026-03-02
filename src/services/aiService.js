import { GoogleGenerativeAI } from "@google/generative-ai";

// Apni Gemini API Key yahan paste karein (Ya .env file se uthayein)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// 1. Symptom Analyzer (Neural Diagnostic)
export const analyzeSymptoms = async (symptoms) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `As a professional medical AI assistant, analyze these symptoms: "${symptoms}". 
  Provide 3 possible diagnosis and 2 recommended initial tests. 
  Keep the tone professional and brief. Format: HTML list.`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// 2. Prescription Safety Checker
export const checkMedicationSafety = async (medicines, history) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `The doctor is prescribing: "${medicines}". 
  The patient's medical history is: "${history}". 
  Check for any drug-drug interactions or allergies. 
  If safe, say "Status: Nominal". If risky, explain the danger in 2 lines.`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// 3. History Summarizer
export const summarizeHistory = async (historyData) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Summarize this patient's medical history into a 3-bullet point "Executive Summary" for a busy doctor: "${historyData}"`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};

// 4. Patient Chatbot Logic
export const getChatbotResponse = async (query, patientData) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Context: You are the CareStream AI assistant. Patient data: ${JSON.stringify(patientData)}. 
  Question: ${query}. Answer briefly and kindly. Avoid giving definitive medical diagnosis, suggest consulting a doctor for serious issues.`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};