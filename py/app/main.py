from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.routes import router

REPO_ROOT = Path(__file__).resolve().parents[2]
DIST_DIR = REPO_ROOT / "js" / "blog-ui" / "dist"

app = FastAPI()
app.include_router(router)
app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="frontend")


def main():
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)


if __name__ == "__main__":
    main()
