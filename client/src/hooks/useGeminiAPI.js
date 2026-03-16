import { useState, useCallback } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function useGeminiAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateContent = useCallback(
    async (prompt, modelType = "gemini-1.5-flash") => {
      setIsLoading(true);
      setError(null);
      try {
        // Use provided key as global default if local storage is empty
        const GLOBAL_KEY = process.env.VITE_GEMINI_API_KEY || "";
        const apiKey = localStorage.getItem("gemini_api_key") || GLOBAL_KEY;
        if (!apiKey) {
          throw new Error(
            "Gemini API Key is missing. Please contact administrator.",
          );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel(
          { model: modelType },
          { apiVersion: "v1" },
        );
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (err) {
        setError(err.message || "An error occurred while generating content.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { generateContent, isLoading, error };
}
