from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
from typing import List

DB_PATH = '../ChatBot/orders.db'

app = FastAPI()

class OrderIn(BaseModel):
    user_id: int
    username: str
    usertag: str
    service: str
    price: int
    details: str

class OrderOut(BaseModel):
    id: int
    user_id: int
    username: str
    usertag: str
    service: str
    price: int
    details: str
    status: str
    result_file: str = ''

# --- Support system ---
class SupportIn(BaseModel):
    user_id: int
    username: str
    usertag: str
    message: str

class SupportOut(BaseModel):
    id: int
    user_id: int
    username: str
    usertag: str
    message: str
    status: str
    answer: str

@app.post('/order', response_model=OrderOut)
def create_order(order: OrderIn):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''INSERT INTO orders (user_id, username, usertag, service, price, details, status, result_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
              (order.user_id, order.username, order.usertag, order.service, order.price, order.details, 'new', ''))
    order_id = c.lastrowid
    conn.commit()
    c.execute('SELECT * FROM orders WHERE id=?', (order_id,))
    row = c.fetchone()
    conn.close()
    return OrderOut(
        id=row[0], user_id=row[1], username=row[2], usertag=row[3], service=row[4], price=row[5], details=row[6], status=row[7], result_file=row[8] or ''
    )

@app.get('/orders/{user_id}', response_model=List[OrderOut])
def get_orders(user_id: int):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT * FROM orders WHERE user_id=? ORDER BY id DESC', (user_id,))
    rows = c.fetchall()
    conn.close()
    return [OrderOut(
        id=row[0], user_id=row[1], username=row[2], usertag=row[3], service=row[4], price=row[5], details=row[6], status=row[7], result_file=row[8] or ''
    ) for row in rows]

# Инициализация таблицы поддержки
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS support (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    username TEXT,
    usertag TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    answer TEXT DEFAULT ''
)''')
conn.commit()
conn.close()

@app.post('/support')
def create_support(support: SupportIn):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''INSERT INTO support (user_id, username, usertag, message, status) VALUES (?, ?, ?, ?, 'new')''',
              (support.user_id, support.username, support.usertag, support.message))
    conn.commit()
    conn.close()
    return {"ok": True}

@app.get('/support/new', response_model=List[SupportOut])
def get_new_support():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT * FROM support WHERE status="new" ORDER BY id ASC')
    rows = c.fetchall()
    conn.close()
    return [SupportOut(id=row[0], user_id=row[1], username=row[2], usertag=row[3], message=row[4], status=row[5], answer=row[6]) for row in rows]

@app.post('/support/answer')
def answer_support(id: int, answer: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE support SET status="answered", answer=? WHERE id=?', (answer, id))
    conn.commit()
    conn.close()
    return {"ok": True} 