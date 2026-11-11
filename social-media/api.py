"""
Rooted - Digital Wellbeing & Time Management API
FastAPI backend powering the Rooted Companion and AI Arborist.
"""

import os
from typing import Dict, Literal, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables from k.env or .env
load_dotenv("k.env")
load_dotenv(".env")

app = FastAPI(
    title="Rooted Wellbeing API",
    description="Backend services for Rooted: ML risk evaluation & the AI Arborist companion.",
    version="1.0.0",
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Data Models
# -----------------------------------------------------------------------------

RiskLevel = Literal["Low", "Medium", "High"]

class DiagnosisPayload(BaseModel):
    age: float = Field(..., description="User age")
    gender: float = Field(..., description="Gender code")
    relationship: float = Field(..., description="Relationship status code")
    occupation: float = Field(..., description="Occupation code")
    org_type: float = Field(..., description="Organization type code")
    platforms: float = Field(..., description="Number of active social platforms")
    usage_hours: float = Field(..., description="Average daily screen time in hours")
    purposeless: float = Field(..., ge=1, le=5, description="Frequency of mindless opening (1-5)")
    distracted: float = Field(..., ge=1, le=5, description="Ease of distraction by notifications (1-5)")
    restless: float = Field(..., ge=1, le=5, description="Restlessness when disconnected (1-5)")
    concentration: float = Field(..., ge=1, le=5, description="Difficulty sustaining focus (1-5)")
    focus_issue: float = Field(..., ge=1, le=5, description="Struggles returning to task (1-5)")
    comparison: float = Field(..., ge=1, le=5, description="Frequency of comparing life to others (1-5)")
    comparison_feelings: float = Field(..., ge=1, le=5, description="Negative affect from comparison (1-5)")
    validation: float = Field(..., ge=1, le=5, description="Need for likes/comments/validation (1-5)")
    interest_fluctuation: float = Field(..., ge=1, le=5, description="Loss of interest in offline hobbies (1-5)")

class MLResults(BaseModel):
    predicted_risk: RiskLevel
    overall_score: float
    probabilities: Dict[str, float]

class DiagnosisResult(BaseModel):
    status: str
    ml_results: MLResults
    ai_consultation: str

class ChatMessagePayload(BaseModel):
    message: str
    language: Optional[str] = "en"

class ChatReply(BaseModel):
    response: str

# -----------------------------------------------------------------------------
# Scoring & Assessment Engine
# -----------------------------------------------------------------------------

def evaluate_risk(payload: DiagnosisPayload) -> MLResults:
    """
    Computes an empirical digital distress score (0-100) and calibrated risk probabilities.
    Features are weighted across 3 psychological pillars:
    - Compulsive / Automatic Usage (35%)
    - Cognitive Fragmentation (35%)
    - Social Comparison & Validation Distress (30%)
    """
    # 1. Compulsive usage sub-score (1-5 normalized to 0-100, plus usage duration)
    compulsive_raw = (payload.purposeless + payload.distracted + payload.restless) / 3.0
    compulsive_score = ((compulsive_raw - 1) / 4.0) * 80 + min(payload.usage_hours * 3.5, 20)
    compulsive_score = max(0, min(100, compulsive_score))

    # 2. Cognitive focus sub-score
    cognitive_raw = (payload.concentration + payload.focus_issue + payload.interest_fluctuation) / 3.0
    cognitive_score = ((cognitive_raw - 1) / 4.0) * 100
    cognitive_score = max(0, min(100, cognitive_score))

    # 3. Emotional distress & comparison
    emotional_raw = (payload.comparison + payload.comparison_feelings + payload.validation) / 3.0
    emotional_score = ((emotional_raw - 1) / 4.0) * 100
    emotional_score = max(0, min(100, emotional_score))

    # Composite weighted distress score (0-100)
    overall_score = round(0.35 * compulsive_score + 0.35 * cognitive_score + 0.30 * emotional_score, 1)

    # Calibrated probability distribution
    if overall_score < 38:
        predicted_risk: RiskLevel = "Low"
        p_low = round(0.70 + (38 - overall_score) / 100 * 0.25, 2)
        p_med = round(1.0 - p_low - 0.05, 2)
        p_high = 0.05
    elif overall_score < 68:
        predicted_risk = "Medium"
        p_med = round(0.60 + (68 - abs(overall_score - 53)) / 100 * 0.2, 2)
        p_low = round((1.0 - p_med) * 0.45, 2)
        p_high = round(1.0 - p_med - p_low, 2)
    else:
        predicted_risk = "High"
        p_high = round(0.65 + (overall_score - 68) / 100 * 0.30, 2)
        p_med = round(1.0 - p_high - 0.05, 2)
        p_low = 0.05

    # Guarantee probabilities sum to 1.0
    total = p_low + p_med + p_high
    probs = {
        "Low": round(p_low / total, 2),
        "Medium": round(p_med / total, 2),
        "High": round(p_high / total, 2),
    }

    return MLResults(
        predicted_risk=predicted_risk,
        overall_score=overall_score,
        probabilities=probs,
    )

# -----------------------------------------------------------------------------
# AI Arborist Engine (Gemini with Fallback)
# -----------------------------------------------------------------------------

ARBORIST_SYSTEM_PROMPT = """You are the Arborist, the gentle, deeply grounded digital wellbeing mentor in Rooted.
You do not speak like a clinical doctor or an authoritarian productivity drill sergeant.
Instead, you treat the user's attention like a garden:
- Screen addiction is shallow, tangled surface roots.
- Focused presence, deep work, and real rest are deep taproots.
- You speak with botanical warmth (soil, pruning, storms, seasons, fertile ground, sunlight).
- Keep your tone concise, soothing, and immediately actionable.
- If the user writes or requests Urdu, reply in poetic, warm Nastaliq Urdu."""

def generate_arborist_consultation(payload: DiagnosisPayload, ml: MLResults) -> str:
    """Generates botanical consultation using Gemini if API key exists, otherwise local heuristic arborist."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    
    if api_key:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = f"""User Diagnosis Data:
- Daily Screen Time: {payload.usage_hours} hours across {payload.platforms} platforms
- Primary Stressors: Mindless opening ({payload.purposeless}/5), Restlessness ({payload.restless}/5), Focus issue ({payload.focus_issue}/5), Validation seeking ({payload.validation}/5)
- Assessed Risk Level: {ml.predicted_risk} (Impact Score: {ml.overall_score}/100)

Deliver an organic reflection for this user. Acknowledge their current soil condition, explain gently what is draining their sap, and offer two practical botanical pruning habits to cultivate this week. Keep within 3 short paragraphs."""
            
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={"system_instruction": ARBORIST_SYSTEM_PROMPT}
            )
            if response.text:
                return response.text.strip()
        except Exception as e:
            # Fall back to heuristic if API call fails
            pass

    # High-quality botanical fallback
    if ml.predicted_risk == "Low":
        return (
            "Your soil is calm, and your roots have plenty of room to breathe. "
            f"With approximately {payload.usage_hours} hours of screen exposure, you have maintained strong boundaries between digital noise and your physical presence.\n\n"
            "To nourish this balance, cultivate intentional offline pauses: morning light before screen light, and closing tabs when your purpose is served. "
            "Your digital canopy is healthy; continue tending it with gentle awareness."
        )
    elif ml.predicted_risk == "Medium":
        return (
            f"Your branches are carrying a noticeable load. An impact score of {ml.overall_score}/100 suggests that automatic scrolling and notification pings "
            "are beginning to fray your focus, creating shallow, restless surface roots.\n\n"
            "Notice where your attention leaks most: often in the transition moments between tasks. "
            "Try establishing a 'buffer zone'—leave a 15-minute gap of screen-free stillness before bed and after waking. "
            "Give your mind the rich, unhurried soil it needs to sink deep roots again."
        )
    else:
        return (
            f"Your garden is weathering a prolonged dry season. An impact score of {ml.overall_score}/100 indicates significant cognitive fatigue, "
            f"driven by {payload.usage_hours} daily hours of fragmented stimulation and constant digital cross-pollination.\n\n"
            "Do not judge the dry branches; they simply need water and pruning. Start small: choose one single platform to prune for the next 48 hours, "
            "and replace the urge to check notifications with a deep breath or a walk on solid ground. "
            "Deep taproots do not grow in a day, but patience always restores fertile ground."
        )

def generate_arborist_chat_reply(message: str, language: str = "en") -> str:
    """Generates conversational responses from the AI Arborist."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

    if api_key:
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            prompt = f"User message ({language}): {message}"
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={"system_instruction": ARBORIST_SYSTEM_PROMPT}
            )
            if response.text:
                return response.text.strip()
        except Exception:
            pass

    # Bilingual fallback responses
    is_urdu = language == "ur" or any('\u0600' <= c <= '\u06FF' for c in message)
    
    if is_urdu:
        return "آپ کی توجہ ایک باغ کی طرح ہے۔ اسکرینوں کا بے مقصد استعمال جڑوں کو خشک کر دیتا ہے۔ آرام سے سانس لیں اور لمحہ بہ لمحہ اپنی عادتوں کو سنواریں۔ میں ہمیشہ آپ کی مدد کے لیے حاضر ہوں۔"

    msg_lower = message.lower()
    if "hello" in msg_lower or "hi" in msg_lower or "hey" in msg_lower:
        return "Welcome back to your garden. How has your attention felt today? Are your thoughts scattered like fallen leaves, or settled deep into the soil?"
    elif "scroll" in msg_lower or "distract" in msg_lower or "phone" in msg_lower:
        return "Mindless scrolling is not a personal failure; modern feeds are engineered to create infinite dry winds. When you catch your thumb reflexively reaching for an app, pause for three breaths. Let the soil settle before deciding whether to open it."
    elif "focus" in msg_lower or "work" in msg_lower:
        return "Focus is like a sapling—it cannot grow if it is repeatedly uprooted every five minutes. Protect a 25-minute window today with zero pings. Let the sap flow uninterrupted."
    else:
        return "I hear you. Notice the rhythm of your day: whenever you feel the restless urge to consume more digital noise, plant your feet firmly on the floor. Take a quiet breath. You are in control of your soil."

# -----------------------------------------------------------------------------
# API Endpoints
# -----------------------------------------------------------------------------

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Rooted Digital Wellbeing API",
        "version": "1.0.0",
        "endpoints": ["/predict_and_consult", "/chat", "/health"]
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/predict_and_consult", response_model=DiagnosisResult)
def predict_and_consult(payload: DiagnosisPayload):
    try:
        ml_results = evaluate_risk(payload)
        consultation = generate_arborist_consultation(payload, ml_results)
        return DiagnosisResult(
            status="success",
            ml_results=ml_results,
            ai_consultation=consultation,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=ChatReply)
def chat(payload: ChatMessagePayload):
    try:
        reply = generate_arborist_chat_reply(payload.message, payload.language or "en")
        return ChatReply(response=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
