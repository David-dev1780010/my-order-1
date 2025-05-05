import os
import sqlite3
from aiogram import Bot, Dispatcher, types
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton, InputFile
from dotenv import load_dotenv
from aiogram.utils import executor
import time
import asyncio

# Загрузка переменных окружения
load_dotenv()
ADMIN_BOT_TOKEN = os.getenv('ADMIN_BOT_TOKEN')
ADMIN_IDS = os.getenv('ADMIN_ID', '').split(',')

bot = Bot(token=ADMIN_BOT_TOKEN)
dp = Dispatcher(bot)

DB_PATH = 'orders.db'

# --- Инициализация базы ---
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        username TEXT,
        usertag TEXT,
        service TEXT,
        price INTEGER,
        details TEXT,
        status TEXT,
        result_file TEXT
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS not_admins (
        user_id INTEGER PRIMARY KEY
    )''')
    conn.commit()
    conn.close()

init_db()

# --- Клавиатуры ---
get_admin_kb = ReplyKeyboardMarkup(resize_keyboard=True).add(KeyboardButton('Получить права администратора'))

# --- /start ---
@dp.message_handler(commands=['start'])
async def start_cmd(message: types.Message):
    user_id = str(message.from_user.id)
    if user_id in ADMIN_IDS:
        await message.answer('Добро пожаловать, администратор! Ожидайте новые заказы.', reply_markup=types.ReplyKeyboardRemove())
        await send_new_orders(message.from_user.id)
    else:
        # Сохраняем не-админа
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('INSERT OR IGNORE INTO not_admins (user_id) VALUES (?)', (user_id,))
        conn.commit()
        conn.close()
        await message.answer('Это админ-бот для @orderenineenngbot. У вас нет прав администратора.', reply_markup=get_admin_kb)

# --- Получить права администратора ---
@dp.message_handler(lambda m: m.text == 'Получить права администратора')
async def get_admin_rights(message: types.Message):
    user_id = str(message.from_user.id)
    if user_id in ADMIN_IDS:
        await message.answer('Права администратора подтверждены! Ожидайте новые заказы.', reply_markup=types.ReplyKeyboardRemove())
        await send_new_orders(message.from_user.id)
    else:
        await message.answer('У вас нет прав администратора. Доступ запрещён.')

# --- Отправка новых заказов админам ---
async def send_new_orders(admin_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM orders WHERE status='new'")
    orders = c.fetchall()
    conn.close()
    for order in orders:
        order_id, user_id, username, usertag, service, price, details, status, result_file = order
        text = f"Новый заказ!🥳\n\nЮзернейм: @{usertag}\nСтоимость: {price}$\nУслуга дизайна: {service}\nТЗ: {details}"
        ikb = InlineKeyboardMarkup().add(InlineKeyboardButton('Отдать заказ', callback_data=f'deliver_{order_id}'))
        await bot.send_message(admin_id, text, reply_markup=ikb)

# --- Кнопка "Отдать заказ" ---
@dp.callback_query_handler(lambda c: c.data.startswith('deliver_'))
async def deliver_order(call: types.CallbackQuery):
    order_id = int(call.data.split('_')[1])
    await call.message.answer('Отправьте мне .png файл заказа (только PNG).')
    dp.register_message_handler(lambda m: True, lambda m: m.from_user.id == call.from_user.id, content_types=types.ContentType.DOCUMENT, state=None, once=True)(lambda m: handle_png(m, order_id, call))

async def handle_png(message: types.Message, order_id, call):
    if not message.document or not message.document.file_name.lower().endswith('.png'):
        await message.answer('Пожалуйста, отправьте именно .png файл!')
        return
    file = await message.document.download()
    file_path = f'order_{order_id}.png'
    with open(file_path, 'wb') as f:
        f.write(file.read())
    # Обновляем заказ в базе
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE orders SET status='done', result_file=? WHERE id=?", (file_path, order_id))
    c.execute("SELECT user_id FROM orders WHERE id=?", (order_id,))
    user_id = c.fetchone()[0]
    conn.commit()
    conn.close()
    await message.answer('PNG принят! Заказ отмечен как выполненный.')
    # Здесь можно реализовать отправку результата в balance_bot.py (например, через базу или отдельный канал)
    # Например, balance_bot.py может периодически проверять базу на новые выполненные заказы

# --- Проверка новых обращений в поддержку ---
async def check_support():
    while True:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT id, username, message FROM support WHERE status='new'")
        supports = c.fetchall()
        for support_id, username, message in supports:
            for admin_id in ADMIN_IDS:
                if not admin_id:
                    continue
                text = f"Пользователь @{username} написал новое сообщение в поддержку:\n\n{message}"
                ikb = InlineKeyboardMarkup().add(InlineKeyboardButton('Ответить пользователю', callback_data=f'support_reply_{support_id}'))
                await bot.send_message(int(admin_id), text, reply_markup=ikb)
            c.execute("UPDATE support SET status='notified' WHERE id=?", (support_id,))
        conn.commit()
        conn.close()
        await asyncio.sleep(10)

# --- Обработка ответа администратора ---
@dp.callback_query_handler(lambda c: c.data.startswith('support_reply_'))
async def support_reply(call: types.CallbackQuery):
    support_id = int(call.data.split('_')[-1])
    await call.message.answer('Введите ответ пользователю. Ваше следующее сообщение будет отправлено ему. (Можно только текст)')
    dp.register_message_handler(lambda m: True, lambda m: m.from_user.id == call.from_user.id, content_types=types.ContentType.TEXT, state=None, once=True)(lambda m: handle_support_answer(m, support_id, call))

async def handle_support_answer(message: types.Message, support_id, call):
    answer = message.text.strip()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE support SET admin_reply=?, status='answered' WHERE id=?", (answer, support_id))
    c.execute("SELECT username FROM support WHERE id=?", (support_id,))
    username = c.fetchone()[0]
    conn.commit()
    conn.close()
    await message.answer('Ответ отправлен пользователю!')
    # Отправка ответа пользователю через обычного бота (balance_bot)
    try:
        from telegram import Bot as TgBot
        USER_BOT_TOKEN = os.getenv('BOT_TOKEN')
        user_bot = TgBot(token=USER_BOT_TOKEN)
        # Получаем user_id по username (или сохраняем user_id в support при обращении)
        # Здесь предполагается, что username = usertag, а user_id можно получить из базы
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT user_id FROM orders WHERE usertag=? ORDER BY id DESC LIMIT 1", (username,))
        row = c.fetchone()
        conn.close()
        if row:
            user_id = row[0]
            text = f"Тех.поддержка ответила вам:\n\n{answer}"
            await user_bot.send_message(chat_id=user_id, text=text)
    except Exception as e:
        print(f"Ошибка отправки ответа пользователю: {e}")

# --- Запуск проверки обращений ---
if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.create_task(check_support())
    executor.start_polling(dp, skip_updates=True) 