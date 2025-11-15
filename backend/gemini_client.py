"""
Gemini API Client - Chat Style Integration
IMPORTANT: Only receives REDACTED text, never raw PII
"""
import os
import aiohttp
import json

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "models/gemini-flash-latest")
GEMINI_API_URL = os.getenv(
    "GEMINI_API_URL",
    "https://generativelanguage.googleapis.com/v1beta"
)


async def query_gemini(redacted_text: str) -> str:
    """
    Send ONLY redacted text to Gemini API
    
    Args:
        redacted_text: Text with PII already redacted (e.g., [PERSON], [EMAIL])
    
    Returns:
        Gemini's response string
    """
    if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        return "⚠️ Gemini API key not configured. Please add your key to .env file."
    
    url = f"{GEMINI_API_URL}/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    
    # Proper payload structure for Gemini API
    payload = {
        "contents": [{
            "parts": [{
                "text": redacted_text
            }]
        }],
        "generationConfig": {
            "temperature": 0.9,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 2048,
        },
        "safetySettings": [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                url,
                json=payload,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=30)
            ) as response:
                response_text = await response.text()
                
                if response.status == 200:
                    try:
                        data = json.loads(response_text)
                    except json.JSONDecodeError:
                        print(f"Failed to parse JSON response: {response_text}")
                        return f"⚠️ Invalid JSON response from Gemini API"
                    
                    # Validate response structure
                    if "candidates" not in data or len(data["candidates"]) == 0:
                        print(f"No candidates in response: {data}")
                        return "⚠️ Gemini returned no candidates. Response may have been blocked."
                    
                    candidate = data["candidates"][0]
                    
                    # Check if blocked by safety filters
                    if candidate.get("finishReason") == "SAFETY":
                        safety_ratings = candidate.get("safetyRatings", [])
                        print(f"Response blocked by safety filters: {safety_ratings}")
                        return "⚠️ Response blocked by safety filters. Content may be inappropriate."
                    
                    # Extract text from response
                    if "content" in candidate and "parts" in candidate["content"]:
                        parts = candidate["content"]["parts"]
                        if len(parts) > 0 and "text" in parts[0]:
                            return parts[0]["text"]
                    
                    print(f"Unexpected response structure: {data}")
                    return "⚠️ Gemini returned an unexpected response format."
                    
                elif response.status == 400:
                    try:
                        error_data = json.loads(response_text)
                        error_msg = error_data.get("error", {}).get("message", "Bad request")
                        print(f"Gemini API 400 error: {error_msg}")
                        return f"⚠️ Invalid request to Gemini: {error_msg}"
                    except:
                        print(f"Gemini API 400 error: {response_text}")
                        return f"⚠️ Invalid request to Gemini API (400)"
                        
                elif response.status == 403:
                    print(f"Gemini API 403 error: {response_text}")
                    return "⚠️ Access denied. Check your API key permissions."
                    
                elif response.status == 429:
                    print(f"Gemini API 429 error: {response_text}")
                    return "⚠️ Rate limit exceeded. Please try again later."
                    
                else:
                    print(f"Gemini API error {response.status}: {response_text}")
                    return f"⚠️ Gemini API error ({response.status}). Check logs for details."
                    
    except aiohttp.ClientError as e:
        print(f"Gemini API connection error: {str(e)}")
        return f"⚠️ Network error connecting to Gemini: {str(e)}"
    except Exception as e:
        print(f"Unexpected error in query_gemini: {str(e)}")
        return f"⚠️ Unexpected error: {str(e)}"
