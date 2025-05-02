from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sqlite3
import os

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модели данных
class UserProfile(BaseModel):
    telegram_id: int
    username: Optional[str] = None
    email: Optional[str] = None
    avatar_url: Optional[str] = None

# Инициализация базы данных
def init_db():
    conn = sqlite3.connect('profiles.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS profiles
        (telegram_id INTEGER PRIMARY KEY,
         username TEXT,
         email TEXT,
         avatar_url TEXT)
    ''')
    conn.commit()
    conn.close()

init_db()

# Эндпоинты
@app.get("/api/profile/{telegram_id}")
async def get_profile(telegram_id: int):
    conn = sqlite3.connect('profiles.db')
    c = conn.cursor()
    c.execute('SELECT * FROM profiles WHERE telegram_id = ?', (telegram_id,))
    profile = c.fetchone()
    conn.close()
    
    if profile is None:
        return {"telegram_id": telegram_id}
    
    return {
        "telegram_id": profile[0],
        "username": profile[1],
        "email": profile[2],
        "avatar_url": profile[3]
    }

@app.post("/api/profile")
async def save_profile(profile: UserProfile):
    conn = sqlite3.connect('profiles.db')
    c = conn.cursor()
    
    # Проверяем существование профиля
    c.execute('SELECT * FROM profiles WHERE telegram_id = ?', (profile.telegram_id,))
    existing = c.fetchone()
    
    if existing:
        # Обновляем существующий профиль
        c.execute('''
            UPDATE profiles 
            SET username = ?, email = ?, avatar_url = ?
            WHERE telegram_id = ?
        ''', (profile.username, profile.email, profile.avatar_url, profile.telegram_id))
    else:
        # Создаем новый профиль
        c.execute('''
            INSERT INTO profiles (telegram_id, username, email, avatar_url)
            VALUES (?, ?, ?, ?)
        ''', (profile.telegram_id, profile.username, profile.email, profile.avatar_url))
    
    conn.commit()
    conn.close()
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 