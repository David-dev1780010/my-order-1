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