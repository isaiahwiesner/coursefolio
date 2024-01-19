from datetime import datetime
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from routers.page_router import page_router
from routers.api_router import api_router
from models import db
from extensions import templates


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(page_router, prefix="")
app.include_router(api_router, prefix="/api")

@app.exception_handler(404)
async def not_found_exception_handler(request: Request, exc: HTTPException):
    return templates.TemplateResponse(
        "pages/not_found.html",
        {"request": request},
    )

db.create_models()