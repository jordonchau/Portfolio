import os
from contextlib import asynccontextmanager
from datetime import datetime

import httpx
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool
from pydantic import BaseModel, Field

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_PUBLISHABLE_KEY"]
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"].lower()

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
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


# ---------- Auth ----------

def require_admin(authorization: str | None = Header(default=None)):
    """Ask Supabase who owns this login token, and only allow the admin email."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not logged in")

    token = authorization.removeprefix("Bearer ")
    try:
        res = httpx.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={"Authorization": f"Bearer {token}", "apikey": SUPABASE_KEY},
            timeout=5,
        )
    except httpx.HTTPError:
        raise HTTPException(status_code=503, detail="Auth service unavailable")

    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Session expired, please log in again")
    if res.json().get("email", "").lower() != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Not authorized")


# ---------- Projects ----------

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


# ---------- Contact ----------

class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(max_length=200, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    message: str = Field(min_length=10, max_length=5000)
    website: str = ""  # hidden spam trap: real people leave it empty


@app.post("/contact", status_code=201)
def create_message(msg: ContactIn):
    if msg.website:
        return {"status": "ok"}

    with pool.connection() as conn:
        conn.execute(
            "insert into messages (name, email, message) values (%s, %s, %s)",
            (msg.name.strip(), msg.email.strip(), msg.message.strip()),
        )
    return {"status": "ok"}


# ---------- Admin ----------

class Message(BaseModel):
    id: int
    name: str
    email: str
    message: str
    created_at: datetime


@app.get("/admin/messages", response_model=list[Message], dependencies=[Depends(require_admin)])
def list_messages():
    with pool.connection() as conn:
        return conn.execute(
            "select id, name, email, message, created_at from messages order by created_at desc"
        ).fetchall()