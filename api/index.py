from fastapi import FastAPI, Request, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
import json
import os

import os

app = FastAPI()

# Mount static files and templates
# Use highly resilient path resolution for Vercel and Local Dev
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))

# Try several common Vercel path patterns
static_paths = [
    os.path.join(root_dir, "public", "static"),
    os.path.join(root_dir, "static"),
    "public/static",
    "static"
]

static_dir = None
for p in static_paths:
    if os.path.exists(p):
        static_dir = p
        break

if static_dir:
    app.mount("/static", StaticFiles(directory=static_dir), name="static")
else:
    # Prevent crash if static folder is missing, but log it
    app.mount("/static", StaticFiles(directory=root_dir), name="static")

template_paths = [
    os.path.join(root_dir, "templates"),
    "templates"
]

template_dir = None
for p in template_paths:
    if os.path.exists(p):
        template_dir = p
        break

if template_dir:
    templates = Jinja2Templates(directory=template_dir)
else:
    # Create a dummy directory to prevent Jinja2 from crashing
    os.makedirs(os.path.join(root_dir, "templates"), exist_ok=True)
    templates = Jinja2Templates(directory=os.path.join(root_dir, "templates"))

# Handle DATA_FILE for Vercel read-only FS
if os.environ.get("VERCEL"):
    DATA_FILE = "/tmp/requests.json"
else:
    DATA_FILE = os.path.join(root_dir, "requests.json")

@app.get("/", response_class=HTMLResponse)
@app.get("/api/index", response_class=HTMLResponse)
async def read_root(request: Request):
    try:
        template = templates.env.get_template("index.html")
        content = template.render({"request": request})
        return HTMLResponse(content=content)
    except Exception as e:
        return HTMLResponse(content=f"Template Error: {str(e)}", status_code=500)

@app.post("/api/contact")
async def contact_form(
    name: str = Form(...), 
    email: str = Form(...), 
    message: str = Form(...)
):
    data = {"name": name, "email": email, "message": message}
    
    # Save to a local JSON file as a simple DB
    requests_list = []
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            try:
                requests_list = json.load(f)
            except json.JSONDecodeError:
                requests_list = []
    
    requests_list.append(data)
    with open(DATA_FILE, "w") as f:
        json.dump(requests_list, f, indent=4)
        
    return JSONResponse(content={"status": "success", "message": "Votre demande a été tressée dans notre réseau !"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
