"""
Pydantic Models for Request/Response Validation
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class LLMProvider(str, Enum):
    """Supported LLM providers"""
    GEMINI = "gemini"
    OPENAI = "openai"


class AnalyzeRequest(BaseModel):
    """Request model for /v1/analyze endpoint"""
    text: str = Field(..., description="Text to analyze for PII", min_length=1)
    llm_provider: Optional[LLMProvider] = Field(
        default=LLMProvider.GEMINI,
        description="LLM provider to use (gemini or openai)"
    )
    model: Optional[str] = Field(
        default=None,
        description="Specific model to use (e.g., gpt-4, gpt-3.5-turbo, gemini-1.5-flash)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "My name is John Doe and my email is john@example.com",
                "llm_provider": "openai",
                "model": "gpt-3.5-turbo"
            }
        }


class EntityDetection(BaseModel):
    """Detected entity model"""
    entity_type: str = Field(..., description="Type of entity (e.g., PERSON, EMAIL)")
    start: int = Field(..., description="Start position in text")
    end: int = Field(..., description="End position in text")
    score: float = Field(..., description="Confidence score (0-1)")
    text: str = Field(..., description="Original text of the entity")
    
    class Config:
        json_schema_extra = {
            "example": {
                "entity_type": "PERSON",
                "start": 11,
                "end": 19,
                "score": 0.95,
                "text": "John Doe"
            }
        }


class AnalyzeResponse(BaseModel):
    """Response model for /v1/analyze endpoint"""
    original_text: str = Field(..., description="Original input text")
    redacted_text: str = Field(..., description="Text with PII redacted")
    entities: List[EntityDetection] = Field(..., description="List of detected entities")
    privacy_score: int = Field(..., description="Privacy risk score (0-100)", ge=0, le=100)
    llm_response: str = Field(..., description="Response from LLM (Gemini or OpenAI)")
    llm_provider: str = Field(..., description="LLM provider used")
    # Keep gemini_response for backward compatibility
    gemini_response: Optional[str] = Field(None, description="Deprecated: use llm_response")
    
    class Config:
        json_schema_extra = {
            "example": {
                "original_text": "My name is John Doe and my email is john@example.com",
                "redacted_text": "My name is [PERSON] and my email is [EMAIL]",
                "entities": [
                    {
                        "entity_type": "PERSON",
                        "start": 11,
                        "end": 19,
                        "score": 0.95,
                        "text": "John Doe"
                    },
                    {
                        "entity_type": "EMAIL_ADDRESS",
                        "start": 36,
                        "end": 52,
                        "score": 1.0,
                        "text": "john@example.com"
                    }
                ],
                "privacy_score": 33,
                "gemini_response": "I understand you want to share information. However, I notice some personal details have been redacted for your privacy."
            }
        }


class HealthResponse(BaseModel):
    """Response model for /health endpoint"""
    status: str = Field(..., description="Health status")
    version: str = Field(..., description="API version")
    service: Optional[str] = Field(None, description="Service name")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "ok",
                "version": "v1",
                "service": "securAI"
            }
        }
