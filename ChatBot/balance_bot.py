import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import requests
from flask import Flask, request, jsonify
import threading
import hmac
from hashlib import sha256
import os
from dotenv import load_dotenv
import sqlite3
from aiogram import Bot, Dispatcher, types, executor
import asyncio

# Загружаем переменные окружения
load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")
CRYPTO_PAY_TOKEN = os.getenv("CRYPTO_PAY_TOKEN")

if not BOT_TOKEN or not CRYPTO_PAY_TOKEN:
    raise ValueError("Не найдены необходимые токены в переменных окружения")

logging.basicConfig(level=logging.INFO)

# Балансы пользователей (user_id: balance)
balances = {}

# Инициализация базы данных
def init_db():
    conn = sqlite3.connect("orders.db")
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
        result_file TEXT,
        notified INTEGER DEFAULT 0,
        delivered INTEGER DEFAULT 0
    )''')
    conn.commit()
    conn.close()

init_db()

# Flask-приложение для webhook и баланса
app = Flask(__name__)

@app.route('/crypto_pay_webhook', methods=['POST'])
def crypto_pay_webhook():
    signature = request.headers.get('crypto-pay-api-signature')
    raw_body = request.get_data()  # raw bytes
    secret = sha256(CRYPTO_PAY_TOKEN.encode()).digest()
    h = hmac.new(secret, raw_body, 'sha256').hexdigest()
    if h != signature:
        return jsonify({'ok': False, 'error': 'Invalid signature'}), 403

    data = request.json
    if data.get('update_type') == 'invoice_paid':
        invoice = data.get('payload', {})
        user_id = invoice.get('user_id')
        amount = float(invoice.get('amount', 0))
        if user_id:
            balances[user_id] = balances.get(user_id, 0) + amount
            # Отправляем сообщение об успехе
            requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage', json={
                'chat_id': user_id,
                'text': f'✅ Оплата прошла успешно! Баланс пополнен на {amount} USDT.'
            })
    return jsonify(ok=True)

@app.route('/get_balance', methods=['GET'])
def get_balance():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify(balance=0)
    return jsonify(balance=balances.get(int(user_id), 0))

# --- Telegram Bot ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if context.args and context.args[0].startswith("balance_"):
        try:
            amount = float(context.args[0].replace("balance_", ""))
        except Exception:
            await update.message.reply_text("Некорректная сумма.")
            return
        url = "https://pay.crypt.bot/api/createInvoice"
        headers = {
            "Crypto-Pay-API-Token": CRYPTO_PAY_TOKEN
        }
        data = {
            "asset": "USDT",
            "amount": str(amount),
            "description": "Пополнение баланса в мини-приложении",
            "user_id": update.effective_user.id
        }
        response = requests.post(url, headers=headers, json=data)
        result = response.json()
        if result.get("ok"):
            invoice_url = result["result"].get("pay_url") or result["result"].get("bot_invoice_url")
            keyboard = [
                [InlineKeyboardButton("Pay via CryptoBot", url=invoice_url)]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            # Отправляем анимацию с текстом
            with open('../public/images/Crypto Pay.mp4', 'rb') as video:
                await update.message.reply_animation(
                    animation=video,
                    caption=f"Счет на пополнение баланса на {amount} USDT создан!💰\n\nНажмите кнопку ниже для оплаты:",
                    reply_markup=reply_markup
                )
        else:
            await update.message.reply_text("Ошибка при создании счета.")
        return
    
    keyboard = [
        [InlineKeyboardButton("Open moodern-app", url="https://t.me/orderenineenngbot/Ordering")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    # Отправляем видео как анимацию вместе с текстом
    with open('../public/images/Hello_bot.mp4', 'rb') as video:
        await update.message.reply_animation(
            animation=video,
            caption="Добро пожаловать в Moodern design!👾\n\nЗдесь вы сможете заказать дизайн в нашем мини-приложении🚀",
            reply_markup=reply_markup
        )

async def balance(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if context.args:
        try:
            amount = float(context.args[0])
        except Exception:
            await update.message.reply_text("Некорректная сумма.")
            return
        url = "https://pay.crypt.bot/api/createInvoice"
        headers = {
            "Crypto-Pay-API-Token": CRYPTO_PAY_TOKEN
        }
        data = {
            "asset": "USDT",
            "amount": str(amount),
            "description": "Пополнение баланса в мини-приложении",
            "user_id": update.effective_user.id
        }
        response = requests.post(url, headers=headers, json=data)
        result = response.json()
        if result.get("ok"):
            invoice_url = result["result"].get("pay_url") or result["result"].get("bot_invoice_url")
            keyboard = [
                [InlineKeyboardButton("Pay via CryptoBot", url=invoice_url)]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            # Отправляем анимацию с текстом
            with open('../public/images/Crypto Pay.mp4', 'rb') as video:
                await update.message.reply_animation(
                    animation=video,
                    caption=f"Счет на пополнение баланса на {amount} USDT создан!💰\n\nНажмите кнопку ниже для оплаты:",
                    reply_markup=reply_markup
                )
        else:
            await update.message.reply_text("Ошибка при создании счета.")

# --- Запуск Flask и Telegram Bot параллельно ---
def run_flask():
    app.run(port=5000)

def run_telegram():
    app_telegram = ApplicationBuilder().token(BOT_TOKEN).build()
    app_telegram.add_handler(CommandHandler("start", start))
    app_telegram.add_handler(CommandHandler("Balance", balance))
    app_telegram.run_polling()

async def check_orders():
    while True:
        conn = sqlite3.connect("orders.db")
        c = conn.cursor()
        # Новые заказы (ожидают уведомления)
        c.execute("SELECT id, user_id FROM orders WHERE status='new' AND (notified IS NULL OR notified=0)")
        for order_id, user_id in c.fetchall():
            try:
                await bot.send_message(user_id, "Ваш заказ принят! Ожидайте выполнения.")
                c.execute("UPDATE orders SET notified=1 WHERE id=?", (order_id,))
            except Exception as e:
                print(f"Ошибка отправки уведомления: {e}")
        # Выполненные заказы (ожидают отправки PNG)
        c.execute("SELECT id, user_id, result_file FROM orders WHERE status='done' AND (delivered IS NULL OR delivered=0)")
        for order_id, user_id, result_file in c.fetchall():
            if result_file and os.path.exists(result_file):
                try:
                    await bot.send_document(user_id, open(result_file, "rb"), caption="Ваш заказ выполнен!")
                    c.execute("UPDATE orders SET delivered=1 WHERE id=?", (order_id,))
                except Exception as e:
                    print(f"Ошибка отправки PNG: {e}")
        conn.commit()
        conn.close()
        await asyncio.sleep(10)  # Проверять каждые 10 секунд

async def check_support_requests():
    while True:
        conn = sqlite3.connect("orders.db")
        c = conn.cursor()
        c.execute("SELECT id, username, user_id, message FROM support WHERE status='new'")
        for support_id, username, user_id, message in c.fetchall():
            try:
                if user_id:
                    await bot.send_message(user_id, "Ваш запрос в поддержку успешно отправлен! Ожидайте ответа.")
                c.execute("UPDATE support SET status='user_notified' WHERE id=?", (support_id,))
            except Exception as e:
                print(f"Ошибка отправки уведомления о поддержке: {e}")
        conn.commit()
        conn.close()
        await asyncio.sleep(10)

if __name__ == "__main__":
    # Запускаем Flask в отдельном потоке
    threading.Thread(target=run_flask, daemon=True).start()
    
    # Создаем и запускаем бота
    app_telegram = ApplicationBuilder().token(BOT_TOKEN).build()
    app_telegram.add_handler(CommandHandler("start", start))
    app_telegram.add_handler(CommandHandler("Balance", balance))
    
    # Запускаем проверку заказов и обращений в поддержку
    loop = asyncio.get_event_loop()
    loop.create_task(check_orders())
    loop.create_task(check_support_requests())
    
    # Запускаем бота
    app_telegram.run_polling()