import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool
from pydantic import BaseModel

load_dotenv()

pool = ConnectionPool(
    os.environ["DATABASE_URL"],
    kwargs={"row_factory": dict_row},
    open=False,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    pool.open()
    yield
    pool.close()


app = FastAPI(title="Portfolio API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(","),
    allow_methods=["GET"],
    allow_headers=["*"],
)


class Project(BaseModel):
    id: int
    slug: str
    title: str
    summary: str
    stack: list[str]
    key_result: str | None
    github_url: str | None
    image_url: str | None
    featured: bool
    sort_order: int


COLUMNS = "id, slug, title, summary, stack, key_result, github_url, image_url, featured, sort_order"


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/projects", response_model=list[Project])
def list_projects(featured: bool | None = None):
    sql = f"select {COLUMNS} from projects"
    params: list = []
    if featured is not None:
        sql += " where featured = %s"
        params.append(featured)
    sql += " order by sort_order, id"

    with pool.connection() as conn:
        return conn.execute(sql, params).fetchall()


@app.get("/projects/{slug}", response_model=Project)
def get_project(slug: str):
    with pool.connection() as conn:
        row = conn.execute(
            f"select {COLUMNS} from projects where slug = %s", (slug,)
        ).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return row