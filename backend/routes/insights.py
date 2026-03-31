import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

class SummaryPayload(BaseModel):
    # Depending on what the frontend summarizes, we receive arbitrary keys here.
    # Ex: max_revenue, total_revenue, platform_counts, top_channels, etc.
    data: Dict[str, Any]
    chart_type: str
    metric: str

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


@router.post("/summarise")
async def summarise_data(payload: SummaryPayload):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API Key not configured on backend.")

    try:
        # We craft a dense informative prompt for the liquid model
        system_prompt = (
            "You are an expert Media & Entertainment Analyst working in a Broadcast Studio Control Room. "
            "You provide concise, hard-hitting insights based on the provided aggregate media metrics. "
            "Keep the response brief, professional, and dense with value. "
            "Do not output markdown code blocks formatting, just write plain textual insights. "
            "Keep your thinking internal, just provide the final insight."
        )

        user_content = (
            f"Please generate key insights for the following aggregated data.\n"
            f"Chart Context Focus: {payload.chart_type} looking at {payload.metric}\n"
            f"Data Summary: {payload.data}"
        )

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        # Liquid model through openrouter
        body = {
            "model": "liquid/lfm-2.5-1.2b-thinking:free",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            "max_tokens": 512,
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body)
            response.raise_for_status()
            
            result_json = response.json()
            if "choices" in result_json and len(result_json["choices"]) > 0:
                insight_text = result_json["choices"][0]["message"]["content"]
                return {"insight": insight_text}
            else:
                raise HTTPException(status_code=502, detail="Invalid response format from OpenRouter.")
                
    except httpx.HTTPError as he:
        # Logging here could be helpful
        raise HTTPException(status_code=502, detail=f"Failed to communicate with AI provider: {str(he)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
