from tracer import PyVisionTracer

code = """
a = 10
b = 20
def calc(x, y):
    c = x + y
    return c
d = calc(a, b)
nums = [1, 2, 3]
nums.append(d)
"""

tracer = PyVisionTracer()
result = tracer.run_code(code)

print(f"Status: {result.status}")
if result.error_message:
    print(f"Error: {result.error_message}")

for step in result.steps:
    print(f"Step {step.step_num} | Line {step.line} | Event {step.event}")
    print(f"  Frames: {[f.name for f in step.frames]}")
    if step.frames:
        print(f"  Locals: {[v.name + '=' + v.value for v in step.frames[0].locals]}")
    print(f"  Heap Size: {len(step.heap)}")
    print("-" * 20)
