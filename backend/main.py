from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio

app = FastAPI(title="MediAgent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class AgentState:
    def __init__(self):
        self.raw_data = None
        self.concise_summary = None
        self.detailed_summary = None
        self.risk_assessment = None

class Agent1_OCR_Parser:
    def execute(self, state: AgentState):
        state.raw_data = {"hgb": 9.2, "wbc": 6.5, "plt": 250}
        return state

class Agent2_Concise_Summary:
    def execute(self, state: AgentState):
        state.concise_summary = "Your overall blood test results look mostly normal, but there is one area that needs attention. Your Hemoglobin levels are lower than they should be, which might explain if you've been feeling unusually tired or weak lately. Everything else, including your kidney and liver functions, appears healthy. We recommend discussing this low hemoglobin with a doctor to see if you need an iron supplement or further testing."
        return state

class Agent3_Detailed_Summary:
    def execute(self, state: AgentState):
        state.detailed_summary = "Analysis of the Complete Blood Count (CBC) reveals a clinically significant decrease in Hemoglobin (HGB) at 9.2 g/dL (reference range: 12.0 - 15.5 g/dL for adult females). This presentation is indicative of anemia. \n\nAnalogy: Think of Hemoglobin as the delivery trucks carrying oxygen to your body's cells. Right now, you don't have enough trucks, which means your body isn't getting the oxygen it needs to create energy.\n\nOther key metrics (WBC, Platelets, CMP) remain unremarkable. The specific etiology of the anemia (e.g., iron deficiency, vitamin B12 deficiency) requires further diagnostic differentiation, likely beginning with an iron panel and ferritin level check."
        return state

class Agent4_Risk_Assessment:
    def execute(self, state: AgentState):
        state.risk_assessment = {
            "flagged_biomarker": "Hemoglobin",
            "value": 9.2,
            "unit": "g/dL",
            "reference": "12.0 - 15.5 g/dL",
            "status": "CRITICALLY LOW",
            "recommendation": "Consultation with a Specialist (Hematologist or Primary Care) is highly advised based on flagged criteria.",
            "questions": [
                "What could be causing this drop in my hemoglobin?",
                "Do I need to start taking iron supplements or change my diet?",
                "Are there any other tests I need to find the exact cause?",
                "Is there anything I should look out for, like dizziness or extreme fatigue?"
            ]
        }
        return state

@app.post("/api/analyze")
async def analyze_document():
    # Simulate processing delay
    await asyncio.sleep(1)
    state = AgentState()

    # Run Agent Pipeline
    Agent1_OCR_Parser().execute(state)
    Agent2_Concise_Summary().execute(state)
    Agent3_Detailed_Summary().execute(state)
    Agent4_Risk_Assessment().execute(state)

    return {
        "concise_summary": state.concise_summary,
        "detailed_summary": state.detailed_summary,
        "risk_assessment": state.risk_assessment
    }

@app.post("/api/chat")
async def chat_interaction(req: ChatRequest):
    await asyncio.sleep(1)
    msg = req.message.lower()

    response = "I understand you have questions. Based on your report, your main focus should be on the low Hemoglobin. It's nothing to panic about, but it's important to have a doctor review it so they can prescribe the right treatment, like an iron supplement if needed."

    if "hemoglobin" in msg:
        response = "Hemoglobin is the protein in your red blood cells that carries oxygen. When it's low (like your 9.2 g/dL), it means your body isn't getting as much oxygen as it needs, which can make you feel very tired or weak. It's often easily treated!"

    return {"reply": response}
