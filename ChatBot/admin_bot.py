import os
import sqlite3
from aiogram import Bot, Dispatcher, types
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton, InputFile
from dotenv import load_dotenv
from aiogram.utils import executor
import requests
import asyncio

# Загрузка переменных окружения
load_dotenv()
ADMIN_BOT_TOKEN = os.getenv('ADMIN_BOT_TOKEN')
ADMIN_IDS = os.getenv('ADMIN_ID', '').split(',')
print("ADMIN_IDS:", ADMIN_IDS)

bot = Bot(token=ADMIN_BOT_TOKEN)
dp = Dispatcher(bot)

DB_PATH = 'orders.db'

SUPPORT_API = 'https://my-order-1.onrender.com/support/new'
SUPPORT_ANSWER_API = 'https://my-order-1.onrender.com/support/answer'

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

async def check_support():
    while True:
        try:
            resp = requests.get(SUPPORT_API)
            supports = resp.json() if resp.ok else []
            if supports:
                print('Получены обращения в поддержку:', supports)
            for s in supports:
                username_display = s['username'] if s['username'] else 'нет username'
                usertag_display = s['usertag'] if s['usertag'] else 'нет usertag'
                nickname_display = s['savedUsername'] if 'savedUsername' in s and s['savedUsername'] else 'нет никнейма'
                text = (
                    f"Пользователь:\n"
                    f"- user_id: {s['user_id']}\n"
                    f"- username (Telegram): @{username_display}\n"
                    f"- usertag (из профиля): @{usertag_display}\n"
                    f"- Никнейм: {nickname_display}\n\n"
                    f"Написал в поддержку:\n\n"
                    f"{s['message']}"
                )
                ikb = InlineKeyboardMarkup().add(
                    InlineKeyboardButton(
                        'Ответить пользователю',
                        callback_data=f'support_reply_{s["id"]}_{s["user_id"]}'
                    )
                )
                for admin_id in ADMIN_IDS:
                    if admin_id:
                        await bot.send_message(int(admin_id), text, reply_markup=ikb)
                # Помечаем как отправленное (например, статус "sent")
                requests.post(SUPPORT_ANSWER_API, params={'id': s["id"], 'answer': "__sent__"})
            await asyncio.sleep(10)
        except Exception as e:
            print('Ошибка поддержки:', e)
            await asyncio.sleep(10)

@dp.callback_query_handler(lambda c: c.data.startswith('support_reply_'))
async def support_reply(call: types.CallbackQuery):
    parts = call.data.split('_')
    support_id = int(parts[2])
    user_id = int(parts[3])
    await call.message.answer('Введите ваш ответ пользователю:')

    def check(m):
        return m.from_user.id == call.from_user.id

    msg = await bot.wait_for('message', check=check)
    answer = msg.text

    # Сохраняем ответ в backend
    requests.post(SUPPORT_ANSWER_API, params={'id': support_id, 'answer': answer})
    await msg.answer('Ответ отправлен!')

    # Отправляем ответ пользователю через обычного бота
    try:
        resp = requests.post(
            f'https://api.telegram.org/bot{ADMIN_BOT_TOKEN}/sendMessage',
            json={'chat_id': user_id, 'text': f'Тех.поддержка ответила вам:\n\n{answer}'}
        )
        print('Ответ Telegram API (пользователь):', resp.status_code, resp.text)
    except Exception as e:
        print('Ошибка отправки ответа пользователю:', e)

# --- Ещё один фиктивный комментарий для тестового пуша ---

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.create_task(check_support())
    executor.start_polling(dp, skip_updates=True, allowed_updates=["message", "callback_query"]) 