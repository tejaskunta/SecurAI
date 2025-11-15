"""
OpenAI GPT Client - Chat Integration
IMPORTANT: Only receives REDACTED text, never raw PII
Supports GPT-4 and GPT-3.5-turbo models
"""
import os
import aiohttp
from typing import List, Dict, Optional

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
OPENAI_API_URL = os.getenv(
    "OPENAI_API_URL",
    "https://api.openai.com/v1/chat/completions"
)


async def query_openai(
    redacted_text: str,
    model: str = None,
    conversation_history: Optional[List[Dict[str, str]]] = None,
    system_prompt: Optional[str] = None
) -> str:
    """
    Send ONLY redacted text to OpenAI GPT API
    
    Args:
        redacted_text: Text with PII already redacted (e.g., [PERSON], [EMAIL])
        model: GPT model to use (default: from env or gpt-3.5-turbo)
        conversation_history: Optional list of previous messages for context
        system_prompt: Optional system message to guide the model
    
    Returns:
        GPT's response string
    """
    if not OPENAI_API_KEY or OPENAI_API_KEY == "YOUR_OPENAI_API_KEY_HERE":
        return "⚠️ OpenAI API key not configured. Please add your key to .env file."
    
    # Use provided model or fall back to environment variable
    selected_model = model or OPENAI_MODEL
    
    # Build messages array
    messages = []
    
    # Add system prompt if provided
    if system_prompt:
        messages.append({
            "role": "system",
            "content": system_prompt
        })
    else:
        # Default system prompt
        messages.append({
            "role": "system",
            "content": "You are a helpful AI assistant. Note that the user's message may contain privacy placeholders like [PERSON], [EMAIL], [PHONE], etc. Respond naturally while acknowledging these placeholders when relevant."
        })
    
    # Add conversation history if provided
    if conversation_history:
        messages.extend(conversation_history)
    
    # Add current redacted text
    messages.append({
        "role": "user",
        "content": redacted_text
    })
    
    # Prepare request payload
    payload = {
        "model": selected_model,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1000,
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                OPENAI_API_URL,
                json=payload,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=30)
            ) as response:
                response_text = await response.text()
                
                if response.status == 200:
                    data = await response.json()
                    
                    # Extract text from OpenAI response
                    if "choices" in data and len(data["choices"]) > 0:
                        choice = data["choices"][0]
                        if "message" in choice and "content" in choice["message"]:
                            return choice["message"]["content"].strip()
                    
                    return "GPT returned an empty response."
                
                elif response.status == 401:
                    return "⚠️ OpenAI API authentication failed. Please check your API key."
                
                elif response.status == 429:
                    return "⚠️ OpenAI API rate limit exceeded. Please try again later."
                
                elif response.status == 400:
                    return f"⚠️ OpenAI API request error. Please check your model name and parameters."
                
                else:
                    print(f"OpenAI API error {response.status}: {response_text}")
                    return f"⚠️ OpenAI API error: {response.status}. Please try again."
                    
    except aiohttp.ClientError as e:
        print(f"OpenAI API connection error: {str(e)}")
        return f"⚠️ Could not connect to OpenAI API: {str(e)}"
    except Exception as e:
        print(f"Unexpected error in query_openai: {str(e)}")
        return f"⚠️ Unexpected error: {str(e)}"


async def query_openai_streaming(
    redacted_text: str,
    model: str = None,
    conversation_history: Optional[List[Dict[str, str]]] = None,
    system_prompt: Optional[str] = None
):
    """
    Stream responses from OpenAI GPT API (for future use)
    
    Args:
        redacted_text: Text with PII already redacted
        model: GPT model to use
        conversation_history: Optional conversation context
        system_prompt: Optional system message
    
    Yields:
        Chunks of text as they arrive from the API
    """
    if not OPENAI_API_KEY or OPENAI_API_KEY == "YOUR_OPENAI_API_KEY_HERE":
        yield "⚠️ OpenAI API key not configured."
        return
    
    selected_model = model or OPENAI_MODEL
    
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    if conversation_history:
        messages.extend(conversation_history)
    messages.append({"role": "user", "content": redacted_text})
    
    payload = {
        "model": selected_model,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1000,
        "stream": True
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                OPENAI_API_URL,
                json=payload,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=60)
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    yield f"⚠️ API error {response.status}: {error_text}"
                    return
                
                async for line in response.content:
                    line = line.decode('utf-8').strip()
                    if line.startswith('data: '):
                        data_str = line[6:]
                        if data_str == '[DONE]':
                            break
                        try:
                            import json
                            data = json.loads(data_str)
                            if "choices" in data and len(data["choices"]) > 0:
                                delta = data["choices"][0].get("delta", {})
                                if "content" in delta:
                                    yield delta["content"]
                        except json.JSONDecodeError:
                            continue
    except Exception as e:
        yield f"⚠️ Error: {str(e)}"


def get_available_models() -> List[str]:
    """
    Get list of available OpenAI models
    
    Returns:
        List of model names
    """
    return [
        "gpt-4",
        "gpt-4-turbo-preview",
        "gpt-3.5-turbo",
        "gpt-3.5-turbo-16k"
    ]
