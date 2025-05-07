from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
from typing import List, Optional
import os
from fastapi.middleware.cors import CORSMiddleware
import requests

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../ChatBot/orders.db'))

app = FastAPI()

# Разрешаем CORS для всех доменов (или укажи свой фронт)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Лучше указать конкретный домен Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
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

# --- Support system ---
class SupportIn(BaseModel):
    user_id: Optional[int] = None
    username: str = ''
    usertag: str = ''
    message: str
    savedUsername: str = ''

class SupportOut(BaseModel):
    id: int
    user_id: int
    username: str
    usertag: str
    message: str
    status: str
    answer: str
    savedUsername: str = ''

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
    answer TEXT DEFAULT '',
    savedUsername TEXT DEFAULT ''
)''')
# Проверяем, есть ли столбец usertag, если нет — добавляем
c.execute("PRAGMA table_info(support)")
columns = [row[1] for row in c.fetchall()]
if 'usertag' not in columns:
    c.execute('ALTER TABLE support ADD COLUMN usertag TEXT')
if 'savedUsername' not in columns:
    c.execute('ALTER TABLE support ADD COLUMN savedUsername TEXT DEFAULT ""')
conn.commit()
conn.close()

@app.post('/support')
def create_support(support: SupportIn):
    print("ПРИШЁЛ ЗАПРОС В /support:", support)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''INSERT INTO support (user_id, username, usertag, message, status, savedUsername) VALUES (?, ?, ?, ?, 'new', ?)''',
              (support.user_id, support.username, support.usertag, support.message, support.savedUsername))
    conn.commit()
    # Выводим все обращения из базы для отладки
    c.execute('SELECT * FROM support ORDER BY id DESC')
    all_supports = c.fetchall()
    print('Все обращения в поддержку:', all_supports)
    conn.close()
    # Отправляем уведомление пользователю в Telegram
    TELEGRAM_BOT_TOKEN = os.getenv('BOT_TOKEN')
    if TELEGRAM_BOT_TOKEN and support.user_id:
        try:
            resp = requests.post(f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage', json={
                'chat_id': support.user_id,
                'text': 'Ваш запрос успешно отправлен в поддержку! Ожидайте ответа.'
            })
            print('Ответ Telegram API:', resp.status_code, resp.text)
        except Exception as e:
            print('Ошибка отправки уведомления пользователю:', e)
    else:
        print('BOT_TOKEN или user_id не определены!')
    return {"ok": True}

@app.get('/support/new', response_model=List[SupportOut])
def get_new_support():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT * FROM support WHERE status="new" ORDER BY id ASC')
    rows = c.fetchall()
    conn.close()
    supports = []
    for row in rows:
        try:
            user_id = int(row[1])
            username = str(row[2])
            usertag = str(row[3])
            message = str(row[4])
            status = str(row[5]) if row[5] is not None else ''
            answer = str(row[6])
            savedUsername = row[7] if len(row) > 7 else ''
            if not status:
                continue
            supports.append(SupportOut(
                id=row[0], user_id=user_id, username=username, usertag=usertag, message=message, status=status, answer=answer, savedUsername=savedUsername
            ))
        except Exception as e:
            print('Пропущена битая запись в support:', row, e)
            continue
    return supports

@app.post('/support/answer')
def answer_support(id: int, answer: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('UPDATE support SET status="answered", answer=? WHERE id=?', (answer, id))
    conn.commit()
    conn.close()
    return {"ok": True}

@app.get('/support/answered', response_model=List[SupportOut])
def get_answered_support():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT * FROM support WHERE status="answered" ORDER BY id DESC')
    rows = c.fetchall()
    conn.close()
    supports = []
    for row in rows:
        try:
            user_id = int(row[1])
            username = str(row[2])
            usertag = str(row[3])
            message = str(row[4])
            status = str(row[5]) if row[5] is not None else ''
            answer = str(row[6])
            savedUsername = row[7] if len(row) > 7 else ''
            if not status:
                continue
            supports.append(SupportOut(
                id=row[0], user_id=user_id, username=username, usertag=usertag, message=message, status=status, answer=answer, savedUsername=savedUsername
            ))
        except Exception as e:
            print('Пропущена битая запись в support:', row, e)
            continue
    return supports

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False) 