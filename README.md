# PyVision Compiler

An interactive, animated Python Code Execution Visualizer.

## Features
- **Line-by-Line Execution Tracing:** Built on a custom Python `sys.settrace` sandbox.
- **Visual Call Stack:** Real-time updates of function frames and local variables.
- **Dynamic Heap Graph:** Animated React Flow visualization of arrays, dicts, and object references.
- **AI Explanations:** Gemini-powered plain-text explanations of every step.

## Running Locally (Dev Mode)

1. **Backend:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   ```
   Add your `GEMINI_API_KEY` to `backend/.env` to enable the AI Explanations.
   ```bash
   uvicorn main:app --reload
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Running via Docker

To run the entire stack (Database, Backend API, Frontend App):
```bash
docker-compose up --build
```
