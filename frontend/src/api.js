/**
 * API Client for securAI Backend
 * Handles all HTTP requests with automatic fallback
 */
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Helper function to fetch sample data
const fetchSampleData = async () => {
  const response = await fetch('/sample.json')
  return await response.json()
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Analyze text for PII and get LLM response
 * @param {string} text - Text to analyze
 * @param {string} llmProvider - LLM provider (gemini or openai)
 * @param {string} model - Model to use
 * @returns {Promise<object>} Analysis result
 */
export const analyzeText = async (text, llmProvider = 'gemini', model = null) => {
  try {
    const requestBody = { 
      text,
      llm_provider: llmProvider
    }
    
    // Add model if specified
    if (model) {
      requestBody.model = model
    }
    
    const response = await apiClient.post('/v1/analyze', requestBody)
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('API Error:', error)
    
    // Try to get sample data as fallback
    try {
      const sampleData = await fetchSampleData()
      return {
        success: false,
        offline: true,
        data: sampleData,
        error: error.message,
      }
    } catch (fallbackError) {
      return {
        success: false,
        offline: true,
        error: error.response?.data?.detail || error.message || 'Failed to connect to backend',
      }
    }
  }
}

/**
 * Get sample data (for testing)
 * @returns {Promise<object>} Sample data
 */
export const getSampleData = async () => {
  try {
    const response = await apiClient.get('/v1/sample')
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    // Fallback to local sample
    try {
      const sampleData = await fetchSampleData()
      return {
        success: true,
        data: sampleData,
      }
    } catch (fallbackError) {
      return {
        success: false,
        error: 'Failed to load sample data',
      }
    }
  }
}

/**
 * Health check
 * @returns {Promise<object>} Health status
 */
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health')
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

export default apiClient
