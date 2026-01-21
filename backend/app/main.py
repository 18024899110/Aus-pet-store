from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

from app.api.api_v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Australian Pet Store API",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源
    allow_credentials=False,  # 设为False以支持通配符
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

# Static files with CORS support
from starlette.middleware.cors import CORSMiddleware as StarletteCORSMiddleware
from fastapi.responses import Response
from starlette.staticfiles import StaticFiles as StarletteStaticFiles

class CORSStaticFiles(StarletteStaticFiles):
    async def __call__(self, scope, receive, send):
        async def send_wrapper(message):
            if message['type'] == 'http.response.start':
                headers = list(message.get('headers', []))
                # Add CORS headers
                headers.append((b'access-control-allow-origin', b'*'))
                headers.append((b'access-control-expose-headers', b'*'))
                message['headers'] = headers
            await send(message)
        await super().__call__(scope, receive, send_wrapper)

static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static"))
print(f"Looking for static files at: {static_dir}")
print(f"Directory exists: {os.path.exists(static_dir)}")
if os.path.exists(static_dir):
    app.mount("/static", CORSStaticFiles(directory=static_dir), name="static")
    print("Static files mounted successfully with CORS support")

@app.get("/")
def root():
    return {"message": "Welcome to Australian Pet Store API"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 