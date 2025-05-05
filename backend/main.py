from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
from typing import List
import requests
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

DB_PATH = '../ChatBot/orders.db'

load_dotenv()
USER_BOT_TOKEN = os.getenv('BOT_TOKEN')
ADMIN_BOT_TOKEN = os.getenv('ADMIN_BOT_TOKEN')
ADMIN_IDS = os.getenv('ADMIN_ID', '').split(',')

app = FastAPI()

# Разрешаем CORS для фронта
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Можно указать конкретный адрес, например, "http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class SupportIn(BaseModel):
    username: str
    message: str

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

@app.post('/support')
def support_message(support: SupportIn):
    # Отправляем пользователю уведомление об успешной отправке
    # (ищем user_id по username в базе заказов)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT user_id FROM orders WHERE usertag=? ORDER BY id DESC LIMIT 1', (support.username,))
    row = c.fetchone()
    user_id = row[0] if row else None
    conn.close()
    if user_id:
        requests.post(f'https://api.telegram.org/bot{USER_BOT_TOKEN}/sendMessage', json={
            'chat_id': user_id,
            'text': 'Ваш запрос в поддержку успешно отправлен! Ожидайте ответа.'
        })
    # Отправляем сообщение в админ-бота
    admin_text = f"Пользователь @{support.username} написал новое сообщение в поддержку:\n\n{support.message}"
    for admin_id in ADMIN_IDS:
        if admin_id:
            requests.post(f'https://api.telegram.org/bot{ADMIN_BOT_TOKEN}/sendMessage', json={
                'chat_id': admin_id,
                'text': admin_text,
                'reply_markup': {
                    'inline_keyboard': [[{
                        'text': 'Ответить пользователю',
                        'callback_data': f'reply_support_{support.username}'
                    }]]
                }
            })
    return {'ok': True} 