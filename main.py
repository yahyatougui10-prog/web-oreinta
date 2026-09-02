from fastapi import FastAPI, Request, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
import json
import os

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI()

# Mount static files and templates
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

DATA_FILE = "requests.json"

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    template = templates.env.get_template("index.html")
    content = template.render({"request": request})
    return HTMLResponse(content=content)

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
