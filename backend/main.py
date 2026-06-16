from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import CodeRequestModel, TraceResultModel
from tracer import PyVisionTracer

app = FastAPI(title="PyVision Compiler API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to PyVision Compiler API"}

@app.post("/execute", response_model=TraceResultModel)
def execute_code(request: CodeRequestModel):
    tracer = PyVisionTracer(max_steps=2000)
    result = tracer.run_code(request.code)
    return result

class ExplainRequestModel(BaseModel):
    code: str
    step_data: dict

@app.post("/explain")
def explain_step(request: ExplainRequestModel):
    from explainer import generate_explanation
    text = generate_explanation(request.code, request.step_data)
    return {"explanation": text}
