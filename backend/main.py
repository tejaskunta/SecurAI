"""
PrivacyShield.AI Backend - Main API Entry Point
Team: CodeRed
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
import uvicorn

from privacy_engine import analyze_text, calculate_privacy_score
from gemini_client import query_gemini
from db import save_audit_log
from models import AnalyzeRequest, AnalyzeResponse, HealthResponse

load_dotenv()

app = FastAPI(
    title="securAI",
    description="Privacy-first AI prompt analyzer with PII redaction",
    version="1.0.0"
)

# CORS Configuration
origins = os.getenv("ALLOW_ORIGINS", "http://localhost:5173,http://localhost:5174").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount public folder for static files
app.mount("/public", StaticFiles(directory="public"), name="public")


@app.get("/", response_model=dict)
async def root():
    """Root endpoint"""
    return {
        "service": "securAI",
        "team": "CodeRed",
        "version": "v1.0.0",
        "endpoints": {
            "analyze": "/v1/analyze",
            "sample": "/v1/sample",
            "health": "/health"
        }
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="ok",
        version="v1",
        service="PrivacyShield.AI"
    )


@app.post("/v1/analyze", response_model=AnalyzeResponse)
async def analyze_prompt(request: AnalyzeRequest):
    """
    Analyze text for PII, redact sensitive data, and forward to Gemini
    
    Process:
    1. Analyze text with Presidio
    2. Calculate privacy score
    3. Redact PII
    4. Send ONLY redacted text to Gemini
    5. Log to MongoDB (without raw PII)
    6. Return results
    """
    try:
        if not request.text or len(request.text.strip()) == 0:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Step 1 & 2: Analyze and detect entities
        analysis_result = analyze_text(request.text)
        
        # Step 3: Calculate privacy score
        privacy_score = calculate_privacy_score(analysis_result["entities"])
        
        # Step 4: Get redacted text
        redacted_text = analysis_result["redacted_text"]
        
        # Step 5: Query Gemini with ONLY redacted text
        gemini_response = await query_gemini(redacted_text)
        
        # Step 6: Prepare response
        response = AnalyzeResponse(
            original_text=request.text,
            redacted_text=redacted_text,
            entities=analysis_result["entities"],
            privacy_score=privacy_score,
            gemini_response=gemini_response
        )
        
        # Step 7: Save audit log (without raw PII)
        await save_audit_log({
            "privacy_score": privacy_score,
            "entity_types": [e["entity_type"] for e in analysis_result["entities"]],
            "entity_count": len(analysis_result["entities"]),
            "input_length": len(request.text),
            "output_length": len(gemini_response),
            "redacted_text_sample": redacted_text[:100]  # Only first 100 chars
        })
        
        return response
        
    except Exception as e:
        print(f"Error in analyze_prompt: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/v1/sample")
async def get_sample():
    """Return sample data for frontend fallback"""
    import json
    try:
        with open("public/sample.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {
            "original_text": "Sample data not available",
            "redacted_text": "Sample data not available",
            "entities": [],
            "privacy_score": 0,
            "gemini_response": "This is sample fallback data. Backend is unavailable."
        }


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
