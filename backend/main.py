# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from langchain_mcp_adapters.tools import load_mcp_tools
from langgraph.prebuilt import create_react_agent
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from dotenv import load_dotenv
import asyncio
import os
from contextlib import asynccontextmanager

load_dotenv()

# Globals
session = None
tools = None
agent = None

model = ChatNVIDIA(
    model="openai/gpt-oss-120b",
    api_key=os.getenv("NVIDIA_API_KEY"),
    temperature=1,
    top_p=1,
    max_completion_tokens=4096,  # Fixed: Back to max_completion_tokens (correct for NVIDIA)
)

server_params = StdioServerParameters(
    command="npx",
    env={"FIRECRAWL_API_KEY": os.getenv("FIRECRAWL_API_KEY")},
    args=["firecrawl-mcp"]
)

async def init_agent():
    global session, tools, agent
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as s:
            session = s
            await session.initialize()
            tools = await load_mcp_tools(session)
            agent = create_react_agent(model, tools)
            print("Agent ready")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_agent()
    yield
    # Shutdown
    #if session:
        #await session.close()

app = FastAPI(lifespan=lifespan)

# Allow frontend (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ask")
async def ask_question(payload: dict):
    question = payload.get("question")
    if not question:
        return {"error": "No question provided"}

    messages = [{"role": "user", "content": question}]
    try:
        response = await agent.ainvoke({"messages": messages})
        ai_message = response["messages"][-1].content
        return {"answer": ai_message}
    except Exception as e:
        return {"error": str(e)}
