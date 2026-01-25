from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="./app/static"), name="static")

@app.get("/")
async def read_root():
    with open("./app/frontend/index.html", "r") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content, status_code=200)

@app.get("/api/hello")
async def read_item():
    return {"message": "Hello, World!"}
