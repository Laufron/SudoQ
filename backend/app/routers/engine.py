from fastapi import APIRouter

router = APIRouter(
    prefix="/engine",
    tags=["engine"],
)


@router.get("/")
async def hello_engine():
    return {"message": "Hello, engine"}
