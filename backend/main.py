from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.insights import router as insights_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Media Insights Dashboard Backend")


# Allowing all for development purposes. You can restrict this to localhost:3000 or the specific frontend IP.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(insights_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Media Insights API. Use /api/summarise for insights."}
