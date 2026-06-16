import sys
import io
import traceback
from typing import Any, Dict, List
from models import TraceResultModel, TraceStepModel, FrameModel, VariableModel, HeapObjectModel

PRIMITIVE_TYPES = (int, float, str, bool, type(None))

class PyVisionTracer:
    def __init__(self, max_steps: int = 1000):
        self.steps: List[TraceStepModel] = []
        self.max_steps = max_steps
        self.step_count = 0
        self.heap: Dict[str, HeapObjectModel] = {}
        self.stdout_capture = io.StringIO()
        self.original_stdout = sys.stdout

    def _get_ref_id(self, obj: Any) -> str:
        return str(id(obj))

    def _serialize_object(self, obj: Any) -> Any:
        if isinstance(obj, (list, tuple, set)):
            res = []
            for v in obj:
                vt, vs, vr = self._process_value(v)
                res.append({"type": vt, "value": vs, "ref": vr})
            return res
        elif isinstance(obj, dict):
            res = {}
            for k, v in obj.items():
                vt, vs, vr = self._process_value(v)
                res[str(k)] = {"type": vt, "value": vs, "ref": vr}
            return res
        else:
            return str(obj)

    def _process_value(self, value: Any) -> tuple[str, str, str | None]:
        # returns (type_str, value_str, ref_id)
        val_type = type(value).__name__
        if isinstance(value, PRIMITIVE_TYPES):
            return val_type, repr(value), None
        
        ref_id = self._get_ref_id(value)
        if ref_id not in self.heap:
            self.heap[ref_id] = HeapObjectModel(
                id=ref_id,
                type=val_type,
                value=self._serialize_object(value)
            )
        else:
            # Update heap object in case it mutated
            self.heap[ref_id].value = self._serialize_object(value)
            
        return val_type, str(value), ref_id

    def trace_callback(self, frame, event, arg):
        if self.step_count >= self.max_steps:
            return None # Stop tracing

        # Ignore tracer internal frames or standard library frames if needed
        # For a sandbox, we might only want to trace the user's code, which we'll execute as '<string>'
        if frame.f_code.co_filename != "<string>":
             return self.trace_callback

        self.step_count += 1

        # Capture Frames (Call Stack)
        frames_list = []
        f = frame
        while f is not None and f.f_code.co_filename == "<string>":
            f_locals_list = []
            for n, v in f.f_locals.items():
                if n.startswith('__'): continue
                vt, vs, vr = self._process_value(v)
                f_locals_list.append(VariableModel(name=n, type=vt, value=vs, ref_id=vr))
            
            frames_list.insert(0, FrameModel(
                name=f.f_code.co_name,
                line=f.f_lineno,
                locals=f_locals_list
            ))
            f = f.f_back

        # Copy the heap deeply enough for snapshots. Since values are primitive strings/lists, model.copy() or dict() works.
        # Deepcopying the heap values is important so history doesn't overwrite.
        import copy
        current_heap = copy.deepcopy(self.heap)

        step = TraceStepModel(
            step_num=self.step_count,
            line=frame.f_lineno,
            event=event,
            stdout=self.stdout_capture.getvalue(),
            frames=frames_list,
            heap=current_heap
        )
        self.steps.append(step)
        return self.trace_callback

    def run_code(self, code: str) -> TraceResultModel:
        self.steps = []
        self.step_count = 0
        self.heap = {}
        self.stdout_capture = io.StringIO()
        
        sys.stdout = self.stdout_capture
        sys.settrace(self.trace_callback)
        
        error_msg = None
        status = "success"
        
        try:
            global_env = {}
            # Execute with '<string>' filename to match the trace logic
            exec(compile(code, '<string>', 'exec'), global_env)
        except Exception as e:
            status = "error"
            error_msg = "".join(traceback.format_exception_only(type(e), e))
        finally:
            sys.settrace(None)
            sys.stdout = self.original_stdout

            import copy
            final_step = TraceStepModel(
                step_num=self.step_count + 1,
                line=0,
                event="finish",
                stdout=self.stdout_capture.getvalue(),
                frames=[],
                heap=copy.deepcopy(self.heap)
            )
            self.steps.append(final_step)

        return TraceResultModel(
            status=status,
            error_message=error_msg,
            steps=self.steps
        )
