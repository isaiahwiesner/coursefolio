from datetime import datetime
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from models import db
from routers.page_router import page_router
from routers.api_router import api_router


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(page_router, prefix="")
app.include_router(api_router, prefix="/api")

db.create_models()