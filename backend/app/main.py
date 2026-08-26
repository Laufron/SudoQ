from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .internal import admin
from .routers import engine

app = FastAPI()

origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(engine.router)
app.include_router(
    admin.router,
    prefix="/admin",
    tags=["admin"],
)


@app.get("/")
async def root():
    return {"message": "Hello SudoQ"}
