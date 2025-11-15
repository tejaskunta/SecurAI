"""
Gemini API Client - Chat Style Integration
IMPORTANT: Only receives REDACTED text, never raw PII
"""
import os
import aiohttp

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
GEMINI_API_URL = os.getenv(
    "GEMINI_API_URL",
    "https://generativelanguage.googleapis.com/v1beta/models"
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
    
    # Simplified payload
    payload = {
        "contents": [{
            "parts": [{
                "text": redacted_text
            }]
        }]
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
                    data = await response.json()
                    
                    # Extract text from Gemini response
                    if "candidates" in data and len(data["candidates"]) > 0:
                        candidate = data["candidates"][0]
                        if "content" in candidate and "parts" in candidate["content"]:
                            parts = candidate["content"]["parts"]
                            if len(parts) > 0 and "text" in parts[0]:
                                return parts[0]["text"]
                    
                    return "Gemini returned an empty response."
                else:
                    print(f"Gemini API error {response.status}: {response_text}")
                    return f"⚠️ Gemini API error: {response.status}. Check API key and model name."
                    
    except aiohttp.ClientError as e:
        print(f"Gemini API connection error: {str(e)}")
        return f"⚠️ Could not connect to Gemini API: {str(e)}"
    except Exception as e:
        print(f"Unexpected error in query_gemini: {str(e)}")
        return f"⚠️ Unexpected error: {str(e)}"
