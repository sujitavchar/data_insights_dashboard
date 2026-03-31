# Data Insights Dashboard

## Demo :
[![VIDEO_DESCRIPTION](https://img.youtube.com/vi/RoIZGS4TzDE/0.jpg)](https://youtube.com)

## Features
- Transform raw JSON/CSV datasets into intuitive and dynamic charts for quick insights.

- Seamlessly upload and analyze both JSON and CSV files.

- Switch between Bar Charts (categorical comparison) and Line Charts (time-based trends).

- Visualize data across key metrics such as Revenue, Spend, Impressions, and CTR.

- Filter bar charts by selecting specific channels to focus on relevant subsets of data.

- Generate contextual summaries and insights for the currently visualized data.

- Charts update instantly based on selected filters, metrics, and chart types.

## Tech Stack
- Frontend : React, chartjs
- Backend : Python, FastAPI, Open router llm

## Set up 

- Create a .env file  and add OPENROUTER_API_KEY=your_api_key
- Clone the repo and navigate to project folder

```
bash
cd frontend
npm install
npm run start 
```
- For Backend
```
bash 
cd backend
pip install -r "requirements.txt"
uvicorn main:app --reload
```

## AI Usage

- Manually set up project structure for backend and frontend
- Used Google's Antigravity to design UI and generate React components
- Leveraged AI assistance (ChatGPT, Claude) to identify and fix issues related to resolve Environment variable loading, Data aggregation logic
 and React state management and re-rendering
