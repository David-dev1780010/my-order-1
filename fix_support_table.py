import sqlite3

DB_PATH = 'ChatBot/orders.db'

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

# Удаляем старую таблицу
c.execute('DROP TABLE IF EXISTS support')

# Создаём новую таблицу с правильной структурой
c.execute('''
CREATE TABLE support (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    username TEXT,
    usertag TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    answer TEXT DEFAULT '',
    savedUsername TEXT DEFAULT ''
)
''')

conn.commit()
conn.close()
print("Таблица support пересоздана!") 