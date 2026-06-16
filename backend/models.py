from pydantic import BaseModel
from typing import List, Dict, Any, Optional, Union

class VariableModel(BaseModel):
    name: str
    type: str
    value: str # String representation
    ref_id: Optional[str] = None # Used if it points to a heap object

class FrameModel(BaseModel):
    name: str
    line: int
    locals: List[VariableModel]

class HeapObjectModel(BaseModel):
    id: str
    type: str
    value: Any # The actual JSON representation of the object (list, dict, etc)
    # Could add references to other heap objects for graph building

class TraceStepModel(BaseModel):
    step_num: int
    line: int
    event: str # 'line', 'call', 'return', 'exception'
    stdout: str
    frames: List[FrameModel]
    heap: Dict[str, HeapObjectModel]

class TraceResultModel(BaseModel):
    status: str # 'success', 'error'
    error_message: Optional[str] = None
    steps: List[TraceStepModel]

class CodeRequestModel(BaseModel):
    code: str
